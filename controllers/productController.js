const Product = require('../models/Product');

const listProducts = async (msg) => {
    try {
        const products = await Product.find();
        if (products.length === 0) return msg.reply('📦 Saat ini katalog sedang kosong.');

        let listMsg = `📋 *KATALOG APLIKASI PREMIUM* 📋\n\n`;
        products.forEach(p => {
            listMsg += `🏷️ *${p.name}*\n`;
            listMsg += `🔑 Kode: *${p.code}*\n`;
            listMsg += `💰 Harga: Rp ${p.price.toLocaleString('id-ID')}\n`;
            listMsg += `📦 Stok: ${p.stock > 0 ? p.stock + ' Akun Ready' : 'SOLD OUT ❌'}\n`;
            listMsg += `--------------------------\n`;
        });
        listMsg += `\n💡 Ketik *!detail [kode]* untuk melihat keterangan lengkap.`;
        msg.reply(listMsg);
    } catch (err) {
        msg.reply('❌ Gagal mengambil data katalog.');
    }
};

const detailProduct = async (msg, body) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Masukkan kodenya! Contoh: !detail NFLX');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Kode produk tidak ditemukan di katalog.');

        let detailMsg = `🔎 *DETAIL PRODUK: ${item.name}*\n\n`;
        detailMsg += `🔑 *Kode:* ${item.code}\n`;
        detailMsg += `💰 *Harga:* Rp ${item.price.toLocaleString('id-ID')}\n`;
        detailMsg += `📦 *Stok:* ${item.stock > 0 ? item.stock : 'Habis'}\n`;
        detailMsg += `📝 *Deskripsi:*\n${item.description}\n\n`;
        detailMsg += `🛒 Mau beli? Ketik: *!order ${item.code}*`;
        
        msg.reply(detailMsg);
    } catch (err) {
        msg.reply('❌ Terjadi kesalahan saat mencari produk.');
    }
};

module.exports = { listProducts, detailProduct };