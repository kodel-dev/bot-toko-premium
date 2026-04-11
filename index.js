const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. Import Handler
const { handleMessage } = require('./handlers/messageHandler');

// 2. Koneksi Database MongoDB (Dengan penanganan Timeout)
const mongoOptions = {
    serverSelectionTimeoutMS: 60000, // Tambah waktu tunggu server jadi 60 detik
    connectTimeoutMS: 60000,        // Tambah waktu tunggu koneksi jadi 60 detik
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

// FITUR: Auto-Welcome dengan Format Estetik Nanacy Store
client.on('group_join', async (notification) => {
    try {
        const chat = await notification.getChat();
        
        for (let userId of notification.recipientIds) {
            const contact = await client.getContactById(userId);
            
            // Mengambil nama pengguna (pushname) atau nama kontak yang tersimpan
            const userName = contact.pushname || contact.name || contact.shortName || 'Member';
            
            let welcomeMsg = `⋆𐙚 ω𝖾ᥣ𝖼om𝖾 𝗍o 𝖭𝖺𝗇𝖺𝖼𝗒 𝖲𝗍𝗈𝗋𝖾, ${userName}! 𐙚⋆\n`;
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

            // Mengirim pesan tanpa menggunakan mention ID secara langsung di teks
            await chat.sendMessage(welcomeMsg);
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