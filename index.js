const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. Import Handler yang baru
const { handleMessage } = require('./handlers/messageHandler');

// 2. Koneksi Database MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/premiumstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Terhubung ke Database'))
  .catch(err => console.error('❌ Gagal koneksi database:', err));

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

// 4. PANGGIL HANDLER DI SINI
client.on('message', async (msg) => {
    // Semua urusan logika pesan diserahkan ke file messageHandler.js
    await handleMessage(client, msg);
});

client.initialize();