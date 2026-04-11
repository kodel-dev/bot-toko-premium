const Product = require('../models/Product');

const orderProduct = async (client, msg, body, sender) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Masukkan kode aplikasi. Contoh: !order NFLX');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Kode produk tidak valid.');
        if (item.stock <= 0) return msg.reply('⚠️ Maaf, stok produk ini sedang habis.');

        let orderText = `⋆𐙚 𝖨𝖭𝖵𝖮𝖨𝖢𝖤 𝖮𝖱𝖣𝖤𝖱 𐙚⋆\n`;
        orderText += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        orderText += `🛍️ Item: *${item.name}*\n`;
        orderText += `💸 Total: *Rp ${item.price.toLocaleString('id-ID')}*\n\n`;
        
        orderText += `.✦ ݁˖ 𝖯𝖠𝖸𝖬𝖤𝖭𝖳 𝖬𝖤𝖳𝖧𝖮𝖣 💳 :\n`;
        orderText += `─ Ketik 「 payment 」untuk QRIS\n`;
        orderText += `─ DANA/GoPay: 081234567890\n\n`;
        
        orderText += `Kirim bukti transfer ke grup agar diproses.`;
        orderText += `\n─────── ⋆⋅☆⋅⋆ ───────`;

        client.sendMessage(sender, orderText);
    } catch (err) {
        msg.reply('❌ Sistem sedang sibuk.');
    }
};

module.exports = { orderProduct };