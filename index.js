require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const { handleMessage } = require('./utils/handler');

// 1. KONEKSI DATABASE
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Terhubung ✅'))
    .catch(err => console.log('Gagal Konek MongoDB ❌', err));

// 2. SETUP CLIENT
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
});

client.on('qr', (qr) => {
    console.log('SCAN QR CODE:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🚀 Bot Toko Premium Multi-Admin Siap!');
});

// 3. JALANKAN HANDLER PESAN
client.on('message', async (msg) => {
    await handleMessage(client, msg);
});

client.initialize();