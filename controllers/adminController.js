const Product = require('../models/Product');

const addProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('⛔ Akses ditolak.');

    const args = body.slice(5).split('|');
    if (args.length < 5) return msg.reply('❌ Format salah. Cek !help admin.');

    try {
        const code = args[0].trim().toUpperCase();
        const name = args[1].trim();
        const price = parseInt(args[2].trim().replace(/\D/g, ''));
        const desc = args[3].trim();
        const stock = parseInt(args[4].trim().replace(/\D/g, ''));

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