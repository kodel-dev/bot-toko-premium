const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Product = require('./models/Product'); // Memanggil model produk untuk Cron Job
require('dotenv').config();

// 1. Import Handler
const { handleMessage } = require('./handlers/messageHandler');

// 2. Koneksi Database MongoDB (Dengan penanganan Timeout)
const mongoOptions = {
    serverSelectionTimeoutMS: 60000, 
    connectTimeoutMS: 60000,        
    socketTimeoutMS: 60000,
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/premiumstore', mongoOptions)
    .then(() => console.log('✅ Terhubung ke Database MongoDB!'))
    .catch(err => {
        console.error('❌ Gagal koneksi database. Pastikan Network Access di MongoDB Atlas sudah 0.0.0.0/0');
        console.error('Detail Error:', err.message);
    });

// 3. Inisialisasi WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan QR Code di atas untuk login WhatsApp!');
});

client.on('ready', () => {
    console.log('✅ Bot WhatsApp sudah siap dan berjalan!');
});

// FITUR AUTO-REMINDER (Cron Job) - Berjalan setiap jam 09:00 Pagi
cron.schedule('0 9 * * *', async () => {
    console.log('⏳ Menjalankan pengecekan masa aktif langganan Netflix pelanggan...');
    try {
        const today = new Date();
        
        // Setup H-1 dan H-3
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const inThreeDays = new Date(today);
        inThreeDays.setDate(inThreeDays.getDate() + 3);

        const products = await Product.find();
        
        // Looping mendalam ke seluruh produk -> akun -> profil
        for (const product of products) {
            for (const account of product.accounts) {
                for (const profile of account.profiles) {
                    if (profile.customerWa && profile.expiredAt && !profile.isAvailable) {
                        const expDate = new Date(profile.expiredAt);
                        
                        // Cek notifikasi H-1
                        if (expDate.toDateString() === tomorrow.toDateString()) {
                            const msg = `Halo kak! ⚠️ Langganan Netflix kakak untuk produk *${product.name}* (Profil ${profile.profileNumber}) akan *habis BESOK*. Mau perpanjang? Cukup balas *!perpanjang* ya kak!`;
                            await client.sendMessage(profile.customerWa, msg);
                        }
                        // Cek notifikasi H-3
                        else if (expDate.toDateString() === inThreeDays.toDateString()) {
                            const msg = `Halo kak! Langganan Netflix kakak untuk produk *${product.name}* (Profil ${profile.profileNumber}) sisa *3 HARI LAGI*. Jangan lupa perpanjang ya biar gak putus nontonnya! Balas *!perpanjang* jika ingin lanjut.`;
                            await client.sendMessage(profile.customerWa, msg);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error('❌ Gagal menjalankan sistem Auto-Reminder:', err);
    }
});

// FITUR: Auto-Welcome dengan Format Estetik Nanacy Store
client.on('group_join', async (notification) => {
    try {
        const chat = await notification.getChat();
        
        for (let userId of notification.recipientIds) {
            const contact = await client.getContactById(userId);
            
            let welcomeMsg = `⋆𐙚 ω𝖾ᥣ𝖼om𝖾 𝗍o nαnα𝖼𝗒 𝗌𝗍o𝗋𝖾 @${contact.id.user} 𐙚⋆\n`;
            welcomeMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
            welcomeMsg += `Thank you for joining our community! 🤍\n`;
            welcomeMsg += `Hope you find what you're looking for.\n\n`;
            
            welcomeMsg += `.✦ ݁˖ 𝖠𝖣𝖬𝖨𝖭 𝖱𝖴𝖫𝖤𝖲 📝 :\n`;
            welcomeMsg += `── Order no rush (Harap Sabar)\n`;
            welcomeMsg += `── Dilarang chat bot (Auto Block)\n`;
            welcomeMsg += `── Dilarang spam chat/call\n`;
            welcomeMsg += `── Dilarang promosi/Kirim link grup lain\n\n`;

            welcomeMsg += `.✦ ݁˖ 𝖢𝖠𝖱𝖠 𝖮𝖱𝖣𝖤𝖱 🛒 :\n`;
            welcomeMsg += `1. Ketik 「 !list 」untuk melihat pricelist produk.\n`;
            welcomeMsg += `2. Ketik 「 payment 」untuk instruksi pembayaran.\n`;
            welcomeMsg += `3. Kirim bukti transfer ke grup ini.\n`;
            welcomeMsg += `4. Tunggu proses, admin akan kirim detail via chat pribadi.\n\n`;

            welcomeMsg += `─────── ⋆⋅☆⋅⋆ ───────\n`;
            welcomeMsg += `Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა`;

            await chat.sendMessage(welcomeMsg, { mentions: [contact] });
        }
    } catch (err) {
        console.error('Gagal mengirim pesan sambutan:', err);
    }
});

// 4. PANGGIL HANDLER UNTUK PESAN MASUK
client.on('message', async (msg) => {
    await handleMessage(client, msg);
});

client.initialize();