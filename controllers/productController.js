const Product = require('../models/Product');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

// Fitur: Mengubah teks biasa menjadi Font Aesthetic (Bold Sans-Serif)
const toBoldSans = (str) => {
    const diffUpper = 0x1D5D4 - 0x41;
    const diffLower = 0x1D5EE - 0x61;
    return str.replace(/[A-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + diffUpper))
              .replace(/[a-z]/g, c => String.fromCodePoint(c.charCodeAt(0) + diffLower));
};

const listProducts = async (msg) => {
    try {
        const products = await Product.find();
        if (products.length === 0) return msg.reply('📦 Saat ini katalog sedang kosong.');

        let listMsg = `╭ ۫─┄─┈ ִ ׄ⑅ 𝓒𝗮𝘁𝗮𝗹𝗼𝗴𝘂𝗲 ׄ⑅ ──┈\n`;

        products.forEach(p => {
            // Menambahkan kode produk di samping nama agar pelanggan bisa melihat detailnya
            listMsg += `┃ ⁺ִ ꤥ‌ ${toBoldSans(p.name)} — 【${toBoldSans(p.code)}】 𖹭\n`;
        });

        listMsg += `╰ ۫─┈ ִ─┄─┈──┄─────┈\n`;
        listMsg += ` ꒰ ֹ ֪ ⊹ 𝗅𝗂𝗍𝗍𝗅𝖾 𝗇𝗈𝗍𝖾𝖽 ꕀ 𖦹 ࣪⡾ \n\n`;
        listMsg += `ꕤ 𓂂 𝗄𝖾𝗍𝗂𝗄 「 !𝖽𝖾𝗍𝖺𝗂𝗅 𝗄𝗈𝖽𝖾 」𝗎𝗇𝗍𝗎𝗄 𝗂𝗇𝖿𝗈 𝗅𝖾𝗇𝗀𝗄𝖺𝗉\n`;
        listMsg += `ꕤ 𓂂 𝗍𝖺𝗇𝗒𝖺 𝗌𝗍𝗈𝗄 𝗌𝖾𝖻𝖾𝗅𝗎𝗆 𝗈𝗋𝖽𝖾𝗋\n`;
        listMsg += `ꕤ 𓂂 𝗉𝖺𝗒𝗆𝖾𝗇𝗍 𝗏𝗂𝖺 𝖾-𝗐𝖺𝗅𝗅𝖾𝗍 / 𝗊𝗋𝗂𝗌\n`;
        
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
        if (!item) return msg.reply('❌ Kode produk tidak ditemukan.');

        let detailMsg = `⋆𐙚 𝖣𝖤𝖳𝖠𝖨𝖫 𝖯𝖱𐙮𝖣𝖴𝖢𝖳 𐙚⋆\n`;
        detailMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        detailMsg += `🏷️ *Nama:* ${item.name}\n`;
        detailMsg += `🔑 *Kode:* ${item.code}\n`;
        detailMsg += `💰 *Harga:* Rp ${item.price.toLocaleString('id-ID')}\n`;
        detailMsg += `📦 *Stok:* ${item.stock > 0 ? item.stock : 'Habis'}\n\n`;
        detailMsg += `.✦ ݁˖ 𝖣𝖤𝖲𝖪𝖱𝖨𝖯𝖲𝖨 :\n${item.description}\n\n`;
        detailMsg += `🛒 Order? Ketik: *!order ${item.code}*`;
        detailMsg += `\n─────── ⋆⋅☆⋅⋆ ───────`;
        
        msg.reply(detailMsg);
    } catch (err) {
        msg.reply('❌ Terjadi kesalahan saat mencari produk.');
    }
};

// Fitur: Mengirim Foto Pricelist Berdasarkan Nama Aplikasi
const sendPricelist = async (client, msg, sender, productName) => {
    const fileName = `./${productName}.jpg`; 
    try {
        if (fs.existsSync(fileName)) {
            const media = MessageMedia.fromFilePath(fileName);
            await client.sendMessage(sender, media, { caption: `📸 Pricelist untuk *${productName.toUpperCase()}*` });
        } else {
            await client.sendMessage(sender, `_[Gambar pricelist ${productName} belum tersedia]_`);
        }
    } catch (err) {
        msg.reply(`❌ Gagal memuat gambar pricelist.`);
    }
};

module.exports = { listProducts, detailProduct, sendPricelist };