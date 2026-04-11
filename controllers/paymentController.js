const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

const sendPaymentQR = async (client, msg, sender) => {
    let paymentMsg = `⋆𐙚 𝖯𝖠𝖸𝖬𝖤𝖭𝖳 𝖨𝖭𝖥𝖮 𐙚⋆\n`;
    paymentMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
    paymentMsg += `Silakan scan QRIS di atas.\n\n`;
    paymentMsg += `.✦ ݁˖ 𝖮𝖳𝖧𝖤𝖱 𝖬𝖤𝖳𝖧𝖮𝖣 💰 :\n`;
    paymentMsg += `─ DANA/GoPay: 081234567890\n`;
    paymentMsg += `─ BCA: 1234567890 a/n Nanacy\n\n`;
    paymentMsg += `Kirim bukti transfer ke grup ya!`;
    paymentMsg += `\n─────── ⋆⋅☆⋅⋆ ───────`;

    try {
        if (fs.existsSync('./qris.jpg')) {
            const media = MessageMedia.fromFilePath('./qris.jpg');
            await client.sendMessage(sender, media, { caption: paymentMsg });
        } else {
            await client.sendMessage(sender, paymentMsg);
        }
    } catch (err) {
        msg.reply(paymentMsg);
    }
};

module.exports = { sendPaymentQR };