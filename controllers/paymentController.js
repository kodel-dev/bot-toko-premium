const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

const sendPaymentQR = async (client, msg, sender) => {
    try {
        // Path ke gambar QRIS kamu
        const qrPath = path.join(__dirname, '../qris.jpg'); 
        const media = MessageMedia.fromFilePath(qrPath);

        let payMsg = `𓊆.♡ 𝓵ove  | 𝗌𝗉𝗋𝗂𝗇𝗀 𝖿𝖺𝗂𝗋𝗂𝖾𝗌\n`;
        payMsg += `        𝓃𝒶𝓃𝒶𝒸𝓎 𝓈𝓉𝑜𝓇𝑒 \n\n`;
        payMsg += `.✦ ݁˖ 𝖯𝖺𝗒𝗆𝖾𝗇𝗍 𝖢𝖺𝗍𝖺𝗅𝗈𝗀 \n`;
        payMsg += `      𝖲𝗂𝗅𝖺𝗁𝗄𝖺𝗇 𝗌𝖼𝖺𝗇 𝖰𝖱𝖨𝖲 𝖽𝗂𝖺𝗍𝖺𝗌.\n\n`;
        payMsg += `.✦ ݁˖ 𝖮𝗍𝗁𝖾𝗋 𝖬𝖾𝗍𝗁𝗈𝖽 \n`;
        payMsg += `    ─ D𝖺𝗇𝖺/g𝗈𝗉𝖺𝗒: 6289541399907\n`;
        payMsg += `    ─ 𝖡𝖢𝖠               𝖺/𝗇 𝖭𝖺𝗇𝖺𝖼𝗒\n\n`;
        payMsg += `𝖪𝗂𝗋𝗂𝗆 𝗍𝗋𝖺𝗇𝗌𝖿𝖾𝗋 𝗄𝖾 𝗀𝗋𝗎𝗉 𝗂𝗇𝗂 𝗒𝖺!`;

        // Mengirim Gambar QRIS beserta Caption
        await client.sendMessage(sender, media, { caption: payMsg });

    } catch (err) {
        console.error(err);
        msg.reply('❌ Gagal mengirim katalog pembayaran. Pastikan file qris.jpg tersedia.');
    }
};

module.exports = { sendPaymentQR };