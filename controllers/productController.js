const Product = require('../models/Product');

const listProducts = async (msg) => {
    try {
        const products = await Product.find();
        if (products.length === 0) return msg.reply('📦 Saat ini katalog sedang kosong.');

        let listMsg = `⋆𐙚 𝖯𝖱𝖮𝖣𝖴𝖢𝖳 𝖪𝖠𝖳𝖠𝖫𝖮𝖦 𐙚⋆\n`;
        listMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;

        products.forEach(p => {
            // Kalkulasi stok secara dinamis dari profil yang masih available
            let availableStock = 0;
            if (p.accounts && p.accounts.length > 0) {
                p.accounts.forEach(acc => {
                    if (acc.profiles && acc.profiles.length > 0) {
                        acc.profiles.forEach(prof => {
                            if (prof.isAvailable) availableStock++;
                        });
                    }
                });
            }

            listMsg += `🏷️ *${p.name}*\n`;
            listMsg += `🔑 Kode: *${p.code}*\n`;
            listMsg += `💰 Harga: Rp ${p.price.toLocaleString('id-ID')}\n`;
            listMsg += `📦 Stok: ${availableStock > 0 ? availableStock + ' Profil Tersedia' : 'SOLD OUT ❌'}\n`;
            listMsg += `───────────────\n`;
        });

        listMsg += `\n💡 Ketik *!detail [kode]* untuk info lengkap.`;
        listMsg += `\n─────── ⋆⋅☆⋅⋆ ───────`;
        
        msg.reply(listMsg);
    } catch (err) {
        console.error(err);
        msg.reply('❌ Gagal mengambil data katalog.');
    }
};

const detailProduct = async (msg, body) => {
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Masukkan kodenya! Contoh: !detail NFLX');

    try {
        const item = await Product.findOne({ code: code });
        if (!item) return msg.reply('❌ Kode produk tidak ditemukan.');

        // Kalkulasi stok secara dinamis dari profil yang masih available
        let availableStock = 0;
        if (item.accounts && item.accounts.length > 0) {
            item.accounts.forEach(acc => {
                if (acc.profiles && acc.profiles.length > 0) {
                    acc.profiles.forEach(prof => {
                        if (prof.isAvailable) availableStock++;
                    });
                }
            });
        }

        let detailMsg = `⋆𐙚 𝖣𝖤𝖳𝖠𝖨𝖫 𝖯𝖱𝖮𝖣𝖴𝖢𝖳 𐙚⋆\n`;
        detailMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        detailMsg += `🏷️ *Nama:* ${item.name}\n`;
        detailMsg += `🔑 *Kode:* ${item.code}\n`;
        detailMsg += `📈 *Kategori:* ${item.category.toUpperCase()} ${item.isStrong ? '(Strong)' : ''}\n`;
        detailMsg += `💰 *Harga:* Rp ${item.price.toLocaleString('id-ID')}\n`;
        detailMsg += `📦 *Stok:* ${availableStock > 0 ? availableStock + ' Profil Tersedia' : 'Habis'}\n\n`;
        detailMsg += `.✦ ݁˖ 𝖣𝖤𝖲𝖪𝖱𝖨𝖯𝖲𝖨 :\n${item.description || 'Tidak ada deskripsi'}\n\n`;
        detailMsg += `🛒 Order? Ketik: *!order ${item.code}*`;
        detailMsg += `\n─────── ⋆⋅☆⋅⋆ ───────`;
        
        msg.reply(detailMsg);
    } catch (err) {
        console.error(err);
        msg.reply('❌ Terjadi kesalahan saat mencari produk.');
    }
};

module.exports = { listProducts, detailProduct };