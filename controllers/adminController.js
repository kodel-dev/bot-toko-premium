const Product = require('../models/Product');

const addProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('⛔ Akses ditolak.');

    // Memecah pesan berdasarkan Enter (Baris Baru)
    const args = body.split('\n');

    // args[0] adalah "!add", sisanya adalah datanya
    if (args.length < 6) {
        let helpAdd = `⋆𐙚 𝖠𝖣𝖣 𝖯𝖱𝖮𝖣𝖴𝖢𝖳 𝖦𝖴𝖨𝖣𝖤 𐙚⋆\n`;
        helpAdd += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        helpAdd += `Untuk menghindari error, gunakan *ENTER (Baris Baru)* untuk memisah data.\n\n`;
        helpAdd += `*Format:*\n!add\nKODE\nNAMA APLIKASI\nHARGA\nDESKRIPSI\nSTOK\n\n`;
        helpAdd += `*Contoh Penggunaan:*\n!add\nNFLX\nNetflix Premium\n35000\nAkun VIP 1 Bulan\n10\n\n`;
        helpAdd += `─────── ⋆⋅☆⋅⋆ ───────`;
        return msg.reply(helpAdd);
    }

    try {
        const code = args[1].trim().toUpperCase();
        const name = args[2].trim();
        const price = parseInt(args[3].trim().replace(/\D/g, ''));
        const desc = args[4].trim();
        const stock = parseInt(args[5].trim().replace(/\D/g, ''));

        if (isNaN(price) || isNaN(stock)) return msg.reply('❌ Harga dan Stok wajib berupa angka.');

        await Product.findOneAndUpdate(
            { code: code },
            { name, price, description: desc, stock },
            { upsert: true, new: true }
        );

        msg.reply(`⋆𐙚 𝖣𝖠𝖳𝖠𝖡𝖠𝖲𝖤 𝖴𝖯𝖣𝖠𝖳𝖤𝖣 𐙚⋆\n─────── ⋆⋅☆⋅⋆ ───────\n\n✅ Produk: *${name}*\n🔑 Kode: *${code}*\n📦 Stok: *${stock}*\n\n─────── ⋆⋅☆⋅⋆ ───────`);
    } catch (err) {
        msg.reply('❌ Gagal simpan database.');
    }
};

const deleteProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('⛔ Akses ditolak.');
    const code = body.split(' ')[1]?.toUpperCase();

    try {
        const deletedItem = await Product.findOneAndDelete({ code: code });
        if (!deletedItem) return msg.reply(`❌ Kode *${code}* tidak ada.`);
        msg.reply(`⋆𐙚 𝖯𝖱𝖮𝖣𝖴𝖢𝖳 𝖣𝖤𝖫𝖤𝖳𝖤𝖣 𐙚⋆\n─────── ⋆⋅☆⋅⋆ ───────\n\n✅ *${deletedItem.name}* telah dihapus.\n\n─────── ⋆⋅☆⋅⋆ ───────`);
    } catch (err) {
        msg.reply('❌ Error hapus produk.');
    }
};

const sendAccountDone = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('⛔ Akses ditolak.');
    const email = body.slice(6).trim();
    if (!email) return msg.reply('⚠️ Masukkan email pembeli.');

    let doneMsg = `⋆𐙚 𝖮𝖱𝖣𝖤𝖱 𝖢𝖮𝖬𝖯𝖫𝖤𝖳𝖤 𐙚⋆\n`;
    doneMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
    doneMsg += `${email}\n`;
    doneMsg += `lowercase✅\n\n`;
    doneMsg += `*AKUN DONE ✅ SETELAH SUDAH ADA RIWAYAT LANGGANAN DI PLAY STORE!*\n\n`;
    doneMsg += `*CARA LOGIN KETIK DI GRUP KETIK TUTOR LOGIN BOT MATI? CEK DI DESKRIPSI GRUP AJA*\n\n`;
    doneMsg += `*MAKASIH SUDAH MENUNGGU*`;
    doneMsg += `\n─────── ⋆⋅☆⋅⋆ ───────`;

    msg.reply(doneMsg);
};

module.exports = { addProduct, deleteProduct, sendAccountDone };