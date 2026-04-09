const Product = require('../models/Product');

const addProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('⛔ Akses ditolak. Anda bukan Admin.');

    const args = body.slice(5).split('|');

    if (args.length < 5) {
        let helpAdd = `📝 *PANDUAN CRUD: CREATE & UPDATE* 📝\n\n`;
        helpAdd += `Gunakan pemisah tanda *|* untuk menambah atau mengedit data.\n\n`;
        helpAdd += `*Format:* \n!add KODE|NAMA|HARGA|DESKRIPSI|STOK\n\n`;
        helpAdd += `*Contoh Tambah/Edit:* \n_!add SPT|Spotify Premium|25000|Plan Individual 1 Bulan|15_\n\n`;
        helpAdd += `💡 _Sistem akan otomatis mengubah data lama jika KODE sudah ada di database._`;
        return msg.reply(helpAdd);
    }

    try {
        const code = args[0].trim().toUpperCase();
        const name = args[1].trim();
        const price = parseInt(args[2].trim().replace(/\D/g, ''));
        const desc = args[3].trim();
        const stock = parseInt(args[4].trim().replace(/\D/g, ''));

        if (isNaN(price) || isNaN(stock)) return msg.reply('❌ Harga dan Stok wajib berupa angka.');

        await Product.findOneAndUpdate(
            { code: code },
            { name, price, description: desc, stock },
            { upsert: true, new: true }
        );

        msg.reply(`✅ *SUKSES UPDATE DATABASE!*\n\nProduk: *${name}*\nKode: *${code}*\nStok Tersedia: *${stock}*`);
    } catch (err) {
        msg.reply('❌ Gagal menyimpan ke database. Periksa kembali format Anda.');
    }
};

const deleteProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('⛔ Akses ditolak. Anda bukan Admin.');

    const code = body.split(' ')[1]?.toUpperCase();
    
    if (!code) {
        let helpDel = `🗑️ *PANDUAN CRUD: DELETE* 🗑️\n\n`;
        helpDel += `Gunakan perintah ini untuk menghapus produk dari database secara permanen.\n\n`;
        helpDel += `*Format:* \n!del [KODE]\n\n`;
        helpDel += `*Contoh:* \n_!del SPT_`;
        return msg.reply(helpDel);
    }

    try {
        const deletedItem = await Product.findOneAndDelete({ code: code });
        if (!deletedItem) {
            return msg.reply(`❌ Produk dengan kode *${code}* tidak ditemukan.`);
        }
        msg.reply(`✅ *PRODUK DIHAPUS!*\n\nData *${deletedItem.name}* (Kode: ${code}) telah dihapus dari database.`);
    } catch (err) {
        msg.reply('❌ Terjadi kesalahan saat menghapus produk.');
    }
};

module.exports = { addProduct, deleteProduct };