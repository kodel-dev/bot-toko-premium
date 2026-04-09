const Product = require('../models/Product');

const orderProduct = async (client, msg, body, sender) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Masukkan kode aplikasi. Contoh: !order NFLX');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Kode produk tidak valid. Ketik !list untuk melihat katalog.');
        if (item.stock <= 0) return msg.reply('⚠️ Maaf, stok produk ini sedang habis.');

        let orderText = `🛒 *INVOICE PEMESANAN*\n\n`;
        orderText += `🛍️ Item: *${item.name}*\n`;
        orderText += `💸 Total Tagihan: *Rp ${item.price.toLocaleString('id-ID')}*\n\n`;
        orderText += `💳 *METODE PEMBAYARAN:*\n`;
        orderText += `- DANA/GoPay: 081234567890\n`;
        orderText += `- BCA: 1234567890 a/n Bos Premium\n\n`;
        orderText += `Kirimkan bukti transfer kemari agar pesanan segera diproses.`;
        client.sendMessage(sender, orderText);
    } catch (err) {
        msg.reply('❌ Sistem sedang sibuk. Coba beberapa saat lagi.');
    }
};

module.exports = { orderProduct };