const { MessageMedia, List } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// 1. Fungsi Menampilkan Semua Katalog Produk (!list) MENGGUNAKAN TOMBOL DROPDOWN
const listProducts = async (msg) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return msg.reply('❌ Maaf kak, belum ada produk di katalog toko kami.');
        }

        // Siapkan baris menu (rows) untuk dimasukkan ke dalam Dropdown List
        let rows = [];
        
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
            
            let stockInfo = hasProfiles ? (availableStock > 0 ? `${availableStock} Tersedia` : `Habis`) : 'Tersedia';

            // Masukkan produk ke dalam baris tombol
            // Ketika user nge-klik, bot akan menerima teks dari 'title'
            rows.push({
                id: p.code,
                title: p.name, 
                description: `Rp ${p.price.toLocaleString('id-ID')} | Stok: ${stockInfo}`
            });
        });

        // Merakit List Menu
        const sections = [{ title: '✨ Aplikasi Premium', rows: rows }];
        const list = new List(
            `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n✨ 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓽𝓸 𝓝𝓪𝓷𝓪𝓬𝔂 𝓢𝓽𝓸𝓻𝓮 ✨\n⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n\nSilakan klik tombol di bawah ini untuk melihat detail harga, stok, dan gambar produk pilihan kakak 👇`,
            'Lihat Katalog 🛒', // Tulisan di tombol
            sections,
            '╭ ۫─┄─┈ ִ ׄ⑅ 𝓒𝗮𝘁𝗮𝗹𝗼𝗴𝘂𝗲 ׄ⑅ ──┈', // Judul atas
            'Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა' // Footer bawah
        );

        await msg.reply(list);
    } catch (err) {
        console.error(err);
        msg.reply('❌ Gagal mengambil data katalog.');
    }
};

// 2. Fungsi Dinamis: Mengirim Detail dari DB + Gambar (Jika Ketik Nama Apk)
const sendPricelist = async (client, msg, sender, appName) => {
    try {
        const regex = new RegExp(appName, 'i'); 
        const products = await Product.find({
            $or: [
                { name: regex },
                { category: regex },
                { code: regex }
            ]
        });

        if (products.length === 0) {
            return msg.reply(`❌ Maaf kak, produk untuk *${appName.toUpperCase()}* sedang kosong atau belum ditambahkan ke database toko.`);
        }

        let captionMsg = `⋆𐙚 𝖯𝖱𝖨𝖢𝖤𝖫𝖨𝖲𝖳 ${appName.toUpperCase()} 𐙚⋆\n`;
        captionMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;

        products.forEach(item => {
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

            let stockInfo = hasProfiles ? (availableStock > 0 ? `${availableStock} Profil Tersedia` : `Habis ❌`) : 'Tersedia ✅';

            captionMsg += `🏷️ *${item.name}*\n`;
            captionMsg += `🔑 Kode: *${item.code}*\n`;
            captionMsg += `💰 Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
            captionMsg += `📦 Stok: ${stockInfo}\n`;
            captionMsg += `🛒 Order: *!order ${item.code}*\n`;
            captionMsg += `───────────────\n`;
        });

        captionMsg += `\n💡 Silakan gunakan format order di atas, lalu cek menu *payment* untuk metode pembayaran.`;

        const imagePath = path.join(__dirname, `../pricelists/${appName.toLowerCase()}.jpg`);

        if (fs.existsSync(imagePath)) {
            const media = MessageMedia.fromFilePath(imagePath);
            await client.sendMessage(sender, media, { caption: captionMsg });
        } else {
            await msg.reply(captionMsg);
        }
    } catch (err) {
        console.error(err);
        msg.reply(`❌ Gagal memuat detail untuk produk ${appName}.`);
    }
};

// 3. Fungsi Detail Spesifik
const detailProduct = async (msg, body) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Masukkan kodenya! Contoh: !detail NFLX-1P1U');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Kode produk tidak ditemukan di database.');

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
        msg.reply('❌ Terjadi kesalahan.');
    }
};

module.exports = { listProducts, detailProduct, sendPricelist };