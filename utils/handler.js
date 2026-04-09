const Product = require('../models/Product');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase();
    const sender = msg.from;

    // Filter Admin Cerdas
    const adminEnv = process.env.ADMIN_NUMBERS || "";
    const adminNumbers = adminEnv.split(',').map(n => n.trim());
    const isAdmin = adminNumbers.some(adminID => sender.includes(adminID));

    // 1. MENU UTAMA
    if (['menu', 'p', 'halo', 'help'].includes(lowerBody)) {
        let menu = `👑 *PREMIUM STORE MANAGER* 👑\n\n`;
        menu += `Silakan pilih menu transaksi:\n`;
        menu += `🛒 *!list* : Lihat Katalog Produk\n`;
        menu += `🔎 *!detail [kode]* : Info Spesifik Produk\n`;
        menu += `💳 *!order [kode]* : Formulir Pembelian\n`;
        
        if (isAdmin) {
            menu += `\n🛠️ *DASHBOARD ADMIN (CRUD)* \n`;
            menu += `➕ *!add* : Tambah/Update Produk\n`;
            menu += `🗑️ *!del* : Hapus Produk\n`;
        } else {
            menu += `\n👤 *Status:* Pelanggan`;
        }
        
        client.sendMessage(sender, menu);
    }

    // 2. READ: LIST SEMUA PRODUK
    else if (lowerBody === '!list') {
        try {
            const products = await Product.find();
            if (products.length === 0) return msg.reply('📦 Saat ini katalog sedang kosong.');

            let listMsg = `📋 *KATALOG APLIKASI PREMIUM* 📋\n\n`;
            products.forEach(p => {
                listMsg += `🏷️ *${p.name}*\n`;
                listMsg += `🔑 Kode: *${p.code}*\n`;
                listMsg += `💰 Harga: Rp ${p.price.toLocaleString('id-ID')}\n`;
                listMsg += `📦 Stok: ${p.stock > 0 ? p.stock + ' Akun Ready' : 'SOLD OUT ❌'}\n`;
                listMsg += `--------------------------\n`;
            });
            listMsg += `\n💡 Ketik *!detail [kode]* untuk melihat keterangan lengkap.`;
            msg.reply(listMsg);
        } catch (err) {
            msg.reply('❌ Gagal mengambil data katalog.');
        }
    }

    // 3. READ: DETAIL SATU PRODUK (Baru)
    else if (lowerBody.startsWith('!detail ')) {
        const code = body.split(' ')[1]?.toUpperCase();
        if (!code) return msg.reply('⚠️ Masukkan kodenya! Contoh: !detail NFLX');

        try {
            const item = await Product.findOne({ code: code });
            if (!item) return msg.reply('❌ Kode produk tidak ditemukan di katalog.');

            let detailMsg = `🔎 *DETAIL PRODUK: ${item.name}*\n\n`;
            detailMsg += `🔑 *Kode:* ${item.code}\n`;
            detailMsg += `💰 *Harga:* Rp ${item.price.toLocaleString('id-ID')}\n`;
            detailMsg += `📦 *Stok:* ${item.stock > 0 ? item.stock : 'Habis'}\n`;
            detailMsg += `📝 *Deskripsi:*\n${item.description}\n\n`;
            detailMsg += `🛒 Mau beli? Ketik: *!order ${item.code}*`;
            
            msg.reply(detailMsg);
        } catch (err) {
            msg.reply('❌ Terjadi kesalahan saat mencari produk.');
        }
    }

    // 4. CREATE / UPDATE: TAMBAH ATAU EDIT PRODUK (Khusus Admin)
    else if (lowerBody.startsWith('!add')) {
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
    }

    // 5. DELETE: HAPUS PRODUK (Khusus Admin, Baru)
    else if (lowerBody.startsWith('!del')) {
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
    }

    // 6. ORDER PEMBELIAN (Pelanggan)
    else if (lowerBody.startsWith('!order ')) {
        const code = body.split(' ')[1]?.toUpperCase();
        if (!code) return msg.reply('⚠️ Masukkan kode aplikasi. Contoh: !order NFLX');

        try {
            const item = await Product.findOne({ code: code });
            if (!item) return msg.reply('❌ Kode produk tidak valid. Ketik !list untuk melihat katalog.');
            if (item.stock <= 0) return msg.reply('⚠️ Maaf, stok produk ini sedang habis.');

            let orderText = `🛒 *INVOICE PEMESANAN*\n\n`;
            orderText += `🛍️ Item: *${item.name}*\n`;
            orderText += `💸 Total Tagihan: *Rp ${item.price.toLocaleString('id-ID')}*\n\n`;
            orderText += `💳 *METODE PEMBAYARAN:*\n`;
            orderText += `- DANA/GoPay: 081234567890\n`;
            orderText += `- BCA: 1234567890 a/n Bos Premium\n\n`;
            orderText += `Kirimkan bukti transfer kemari agar pesanan segera diproses.`;
            client.sendMessage(sender, orderText);
        } catch (err) {
            msg.reply('❌ Sistem sedang sibuk. Coba beberapa saat lagi.');
        }
    }
};

module.exports = { handleMessage };