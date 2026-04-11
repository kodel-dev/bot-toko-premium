const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const Product = require('./models/Product'); 
require('dotenv').config();

// 1. Import Handlers & Controllers
const { handleMessage } = require('./handlers/messageHandler');
const { getKatalog, prosesOrderMitra } = require('./controllers/apiController');

// 2. Setup Express API Server (UNTUK MITRA)
const app = express();
app.use(cors());
app.use(express.json());

// 3. Koneksi Database MongoDB
const mongoOptions = {
    serverSelectionTimeoutMS: 60000, 
    connectTimeoutMS: 60000,        
    socketTimeoutMS: 60000,
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/premiumstore', mongoOptions)
    .then(() => console.log('✅ Terhubung ke Database MongoDB!'))
    .catch(err => {
        console.error('❌ Gagal koneksi database:', err.message);
    });

// 4. Inisialisasi WhatsApp Client
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

// 5. ROUTING API MITRA
app.get('/api/katalog', getKatalog);

// Oper 'client' WhatsApp ke dalam API agar API bisa menyuruh bot mengirim pesan
app.post('/api/order', (req, res) => prosesOrderMitra(req, res, client));

// 6. FITUR AUTO-REMINDER (Cron Job) - Jalan tiap jam 09:00 Pagi
cron.schedule('0 9 * * *', async () => {
    console.log('⏳ Menjalankan pengecekan masa aktif langganan Netflix pelanggan...');
    try {
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const inThreeDays = new Date(today); inThreeDays.setDate(inThreeDays.getDate() + 3);

        const products = await Product.find();
        
        for (const product of products) {
            for (const account of product.accounts) {
                for (const profile of account.profiles) {
                    if (profile.customerWa && profile.expiredAt && !profile.isAvailable) {
                        const expDate = new Date(profile.expiredAt);
                        
                        if (expDate.toDateString() === tomorrow.toDateString()) {
                            const msg = `Halo kak! ⚠️ Langganan *${product.name}* (Profil ${profile.profileNumber}) akan *habis BESOK*. Balas *!order ${product.code}* untuk perpanjang ya kak!`;
                            await client.sendMessage(profile.customerWa, msg);
                        }
                        else if (expDate.toDateString() === inThreeDays.toDateString()) {
                            const msg = `Halo kak! Langganan *${product.name}* (Profil ${profile.profileNumber}) sisa *3 HARI LAGI*. Jangan lupa perpanjang biar gak putus nontonnya!`;
                            await client.sendMessage(profile.customerWa, msg);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error('❌ Gagal menjalankan Auto-Reminder:', err);
    }
});

// 7. Auto-Welcome Format Estetik
client.on('group_join', async (notification) => {
    try {
        const chat = await notification.getChat();
        for (let userId of notification.recipientIds) {
            const contact = await client.getContactById(userId);
            
            let welcomeMsg = `⋆𐙚 ω𝖾ᥣ𝖼om𝖾 𝗍o nαnα𝖼𝗒 𝗌𝗍o𝗋𝖾 @${contact.id.user} 𐙚⋆\n`;
            welcomeMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
            welcomeMsg += `Thank you for joining our community! 🤍\n\n`;
            
            welcomeMsg += `.✦ ݁˖ 𝖢𝖠𝖱𝖠 𝖮𝖱𝖣𝖤𝖱 🛒 :\n`;
            welcomeMsg += `1. Ketik 「 !list 」untuk melihat katalog.\n`;
            welcomeMsg += `2. Ketik nama aplikasi (Cth: wink) untuk pricelist.\n`;
            welcomeMsg += `3. Ketik 「 payment 」untuk bayar.\n\n`;

            welcomeMsg += `Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა`;
            await chat.sendMessage(welcomeMsg, { mentions: [contact] });
        }
    } catch (err) {
        console.error('Gagal mengirim pesan sambutan:', err);
    }
});

// 8. PANGGIL HANDLER UNTUK PESAN MASUK
client.on('message', async (msg) => {
    await handleMessage(client, msg);
});

// 9. JALANKAN WHATSAPP & EXPRESS BERSAMAAN
client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 API Server untuk Mitra berjalan di http://localhost:${PORT}`);
});