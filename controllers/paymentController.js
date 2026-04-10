const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

const sendPaymentQR = async (client, msg, sender) => {
    let paymentMsg = `💳 *INFORMASI PEMBAYARAN*\n\n`;
    paymentMsg += `Silakan scan QRIS di atas untuk melakukan pembayaran.\n\n`;
    paymentMsg += `Atau transfer ke:\n`;
    paymentMsg += `- DANA/GoPay: 081234567890\n`;
    paymentMsg += `- BCA: 1234567890 a/n Bos Premium\n\n`;
    paymentMsg += `Kirimkan bukti transfer beserta format order agar pesanan segera diproses.`;

    try {
        // Cek apakah ada file bernama qris.jpg di folder utama (sejajar dengan index.js)
        if (fs.existsSync('./qris.jpg')) {
            const media = MessageMedia.fromFilePath('./qris.jpg');
            await client.sendMessage(sender, media, { caption: paymentMsg });
        } else {
            // Jika gambar tidak ditemukan, kirim teks saja
            await client.sendMessage(sender, `_[Gambar QRIS belum diunggah oleh Admin ke dalam folder server]_\n\n${paymentMsg}`);
        }
    } catch (err) {
        msg.reply('❌ Sistem gagal memuat gambar QR.\n\n' + paymentMsg);
    }
};

module.exports = { sendPaymentQR };