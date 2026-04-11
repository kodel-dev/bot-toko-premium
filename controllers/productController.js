const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// 1. Fungsi Menampilkan Semua Katalog Produk (!list)
const listProducts = async (msg) => {
    try {
        const products = await Product.find();

        let listMsg = `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
        listMsg += `✨ 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓽𝓸 𝓝𝓪𝓷𝓪𝓬𝔂 𝓢𝓽𝓸𝓻𝓮 ✨\n`;
        listMsg += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n`;
        listMsg += `꣑꣒‎ ˚𝒽𝑒𝓁𝓁𝑜𝓌 @everyone 𝅄 ׅ\n`;
        listMsg += `𝅄 ◌ 𐔌 𝗍𝗁𝗂𝗌 𝗂𝗌 𝖺𝖻𝗈𝗎𝗍 𝗅𝗂𝗌𝗍 𝗉𝗋𝗈𝖽𝗎𝗄 ⠟\n`;
        listMsg += `  .𝓒.𝗼𝗻𝘁𝗮𝗰𝘁 — Admin 波\n`;
        listMsg += `𝅄 ◌ 𝗉𝗋𝖾𝗆𝗂𝗎𝗆 𝖺𝗉𝗉𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎 ٠𖹭\n\n`;

        listMsg += `╭ ۫─┄─┈ ִ ׄ⑅ 𝓒𝗮𝘁𝗮𝗹𝗼𝗴𝘂𝗲 ׄ⑅ ──┈\n`;
        
        if (products.length === 0) {
            listMsg += `┃ ⁺ִ ꤥ‌ (Belum ada produk) 𖹭\n`;
        } else {
            products.forEach(p => {
                let availableStock = 0;
                let hasProfiles = false;
                
                if (p.accounts && p.accounts.length > 0) {
                    hasProfiles = true;
                    p.accounts.forEach(acc => {
                        if (acc.profiles && acc.profiles.length > 0) {
                            acc.profiles.forEach(prof => {
                                if (prof.isAvailable) availableStock++;
                            });
                        }
                    });
                }
                
                let stockInfo = '';
                if (hasProfiles) {
                    stockInfo = availableStock > 0 ? ` (Stok: ${availableStock})` : ` (Habis ❌)`;
                }
                
                listMsg += `┃ ⁺ִ ꤥ‌ ${p.name}${stockInfo} 𖹭\n`;
            });
        }

        listMsg += `╰ ۫─┈ ִ─┄─┈──┄─────┈\n\n`;
        
        listMsg += ` ꒰ ֹ ֪ ⊹ 𝗅𝗂𝗍𝗍𝗅𝖾 𝗇𝗈𝗍𝖾𝖽 ꕀ 𖦹 ࣪⡾ \n\n`;
        listMsg += `ꕤ 𓂂 𝗄𝖾𝗍𝗂𝗄 𝗇𝖺𝗆𝖺 𝖺𝗉𝗅𝗂𝗄𝖺𝗌𝗂 𝗎𝗇𝗍𝗎𝗄 𝗅𝗂𝗁𝖺𝗍 𝗁𝖺𝗋𝗀𝖺\n`;
        listMsg += `     (𝖼𝗈𝗇𝗍𝗈𝗁: *wink* 𝖺𝗍𝖺𝗎 *netflix*)\n`;
        listMsg += `ꕤ 𓂂 𝗉𝖺𝗒𝗆𝖾𝗇𝗍 𝗏𝗂𝖺 𝖾-𝗐𝖺𝗅𝗅𝖾𝗍 / 𝗊𝗋𝗂𝗌\n`;

        await msg.reply(listMsg);
    } catch (err) {
        console.error(err);
        msg.reply('❌ Gagal mengambil data katalog.');
    }
};

// 2. Fungsi Dinamis: Mengirim Detail dari DB + Gambar (Jika Ketik Nama Apk)
const sendPricelist = async (client, msg, sender, appName) => {
    try {
        // Cari produk di Database yang namanya, kategorinya, atau kodenya mengandung kata tersebut
        const regex = new RegExp(appName, 'i'); // 'i' membuat pencarian mengabaikan huruf besar/kecil
        const products = await Product.find({
            $or: [
                { name: regex },
                { category: regex },
                { code: regex }
            ]
        });

        // Jika data tidak ditemukan sama sekali di database
        if (products.length === 0) {
            return msg.reply(`❌ Maaf kak, produk untuk *${appName.toUpperCase()}* sedang kosong atau belum ditambahkan ke database toko.`);
        }

        // Mulai merakit pesan detail dari Database
        let captionMsg = `⋆𐙚 𝖯𝖱𝖨𝖢𝖤𝖫𝖨𝖲𝖳 ${appName.toUpperCase()} 𐙚⋆\n`;
        captionMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;

        products.forEach(item => {
            // Hitung stok secara dinamis
            let availableStock = 0;
            let hasProfiles = false;
            
            if (item.accounts && item.accounts.length > 0) {
                hasProfiles = true;
                item.accounts.forEach(acc => {
                    if (acc.profiles && acc.profiles.length > 0) {
                        acc.profiles.forEach(prof => {
                            if (prof.isAvailable) availableStock++;
                        });
                    }
                });
            }

            let stockInfo = '';
            if (hasProfiles) {
                stockInfo = availableStock > 0 ? `${availableStock} Profil Tersedia` : `Habis ❌`;
            } else {
                stockInfo = 'Tersedia ✅'; // Asumsi untuk apk non-sharing/direct link
            }

            captionMsg += `🏷️ *${item.name}*\n`;
            captionMsg += `🔑 Kode: *${item.code}*\n`;
            captionMsg += `💰 Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
            captionMsg += `📦 Stok: ${stockInfo}\n`;
            captionMsg += `🛒 Order: *!order ${item.code}*\n`;
            captionMsg += `───────────────\n`;
        });

        captionMsg += `\n💡 Silakan gunakan format order di atas, lalu cek menu *payment* untuk metode pembayaran.`;

        // Cek apakah ada file gambar di folder pricelists
        const imagePath = path.join(__dirname, `../pricelists/${appName.toLowerCase()}.jpg`);

        if (fs.existsSync(imagePath)) {
            // Jika ada gambar, kirim gambar beserta teks detail sebagai caption
            const media = MessageMedia.fromFilePath(imagePath);
            await client.sendMessage(sender, media, { caption: captionMsg });
        } else {
            // Jika tidak ada gambar, bot tidak error, melainkan tetap kirim teks detailnya
            await msg.reply(captionMsg);
        }
    } catch (err) {
        console.error(err);
        msg.reply(`❌ Gagal memuat detail untuk produk ${appName}.`);
    }
};

// 3. Fungsi Detail (Pencarian Spesifik Menggunakan Kode)
const detailProduct = async (msg, body) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Masukkan kodenya! Contoh: !detail NFLX-1P1U');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Kode produk spesifik tidak ditemukan di database.');

        let availableStock = 0;
        let hasProfiles = false;
        
        if (item.accounts && item.accounts.length > 0) {
            hasProfiles = true;
            item.accounts.forEach(acc => {
                if (acc.profiles && acc.profiles.length > 0) {
                    acc.profiles.forEach(prof => {
                        if (prof.isAvailable) availableStock++;
                    });
                }
            });
        }

        let stockInfo = hasProfiles ? (availableStock > 0 ? `${availableStock} Profil Tersedia` : 'Habis ❌') : 'Tersedia ✅';

        let detailMsg = `⋆𐙚 𝖣𝖤𝖳𝖠𝖨𝖫 𝖯𝖱𝖮𝖣𝖴𝖢𝖳 𐙚⋆\n`;
        detailMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        detailMsg += `🏷️ *Nama:* ${item.name}\n`;
        detailMsg += `🔑 *Kode:* ${item.code}\n`;
        detailMsg += `💰 *Harga:* Rp ${item.price.toLocaleString('id-ID')}\n`;
        detailMsg += `📦 *Stok:* ${stockInfo}\n\n`;
        detailMsg += `.✦ ݁˖ 𝖣𝖤𝖲𝖪𝖱𝖨𝖯𝖲𝖨 :\n${item.description || 'Tidak ada deskripsi'}\n\n`;
        detailMsg += `🛒 Order? Ketik: *!order ${item.code}*`;
        detailMsg += `\n─────── ⋆⋅☆⋅⋆ ───────`;
        
        msg.reply(detailMsg);
    } catch (err) {
        console.error(err);
        msg.reply('❌ Terjadi kesalahan saat mencari detail produk spesifik.');
    }
};

module.exports = { listProducts, detailProduct, sendPricelist };