const Product = require('../models/Product');
const { sendPaymentQR } = require('./paymentController');

const orderProduct = async (client, msg, body, sender) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Contoh: !order NFLX-1P1U');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Produk tidak ditemukan.');

        // Hitung stok tersedia
        let availableCount = 0;
        item.accounts.forEach(acc => {
            acc.profiles.forEach(p => { if (p.isAvailable) availableCount++; });
        });

        if (availableCount === 0) return msg.reply('❌ Maaf, stok produk ini sedang habis.');

        let orderMsg = `⋆𐙚 𝖮𝖱𝖣𝖤𝖱 𝖢𝖮𝖭𝖥𝖨𝖱𝖬𝖠𝖳𝖨𝖮𝖭 𐙚⋆\n`;
        orderMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        orderMsg += `Kamu akan memesan:\n`;
        orderMsg += `🏷️ *${item.name}*\n`;
        orderMsg += `💰 *Total Tagihan:* Rp ${item.price.toLocaleString('id-ID')}\n\n`;
        orderMsg += `Silakan lakukan pembayaran sesuai instruksi di bawah ini:`;

        await msg.reply(orderMsg);
        
        // Panggil payment controller untuk kirim QRIS dan layout teks baru
        return await sendPaymentQR(client, msg, sender);
        
    } catch (err) {
        msg.reply('❌ Terjadi kesalahan sistem saat memproses order.');
    }
};

module.exports = { orderProduct };