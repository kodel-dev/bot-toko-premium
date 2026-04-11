const Product = require('../models/Product');

// 1. Menambah Produk Baru (Shell/Katalog) - DIBUAT UNIVERSAL
const addProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('❌ Akses ditolak. Hanya admin yang bisa menggunakan perintah ini.');
    
    const args = body.split(' ');
    if (args.length < 6) return msg.reply('⚠️ Format salah!\nContoh Netflix: !add NFLX-1P1U Netflix_1P_1U 1p1u 25000 14800\nContoh Canva: !add CNV-1B Canva_Premium 1bulan 10000 5000');

    try {
        const code = args[1].toUpperCase();
        const name = args[2].replace(/_/g, ' ');
        const category = args[3];
        const price = parseInt(args[4]);
        const modalPrice = parseInt(args[5]);

        const newProduct = new Product({
            code: code,
            name: name,
            category: category,
            price: price,
            modalPrice: modalPrice,
            // PERBAIKAN: Deskripsi dibuat universal, tidak lagi memaksa kata "Netflix"
            description: `Layanan Premium ${name} - Kategori: ${category.toUpperCase()}`,
            accounts: []
        });

        await newProduct.save();
        msg.reply(`✅ Produk *${code}* berhasil ditambahkan ke database!`);
    } catch (err) {
        msg.reply('❌ Gagal menambah produk. Kode mungkin sudah ada.');
    }
};

// 2. Menambah Stok Akun Utama (Otomatis pecah jadi profil dengan PIN Tetap - KHUSUS SHARING APP SEPERTI NETFLIX)
const addAccount = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('❌ Akses khusus admin.');
    const args = body.split(' ');
    if (args.length < 6) return msg.reply('⚠️ Format: !addacc [kode] [email] [pass] [YYYY-MM-DD] [jml_profil] [opsional: pin1,pin2...]');

    try {
        const code = args[1].toUpperCase();
        const email = args[2];
        
        let customPins = [];
        let profileCount = 0;
        let expDate = '';
        let password = '';

        // Cek apakah argumen terakhir mengandung koma (berarti admin memasukkan PIN manual)
        if (args[args.length - 1].includes(',')) {
            customPins = args[args.length - 1].split(',');
            profileCount = parseInt(args[args.length - 2]);
            expDate = args[args.length - 3];
            password = args.slice(3, args.length - 3).join(' ');
        } else {
            // Jika tidak ada koma, ikuti pengaturan default
            profileCount = parseInt(args[args.length - 1]);
            expDate = args[args.length - 2];
            password = args.slice(3, args.length - 2).join(' ');
        }

        if (isNaN(profileCount)) {
            return msg.reply('❌ Gagal membaca jumlah profil. Pastikan format benar!');
        }

        const product = await Product.findOne({ code: code });
        if (!product) return msg.reply('❌ Produk tidak ditemukan.');

        const profiles = [];
        for (let i = 1; i <= profileCount; i++) {
            // Logika PIN: Gunakan Custom PIN jika ada. Jika kosong, gunakan nomor profil diulang 4x (1111, 2222)
            let pin = customPins.length >= i ? customPins[i - 1].trim() : String(i).repeat(4);

            profiles.push({
                profileNumber: i,
                pin: pin,
                isAvailable: true
            });
        }

        product.accounts.push({
            email,
            password,
            makerExpiredAt: new Date(expDate),
            profiles: profiles
        });

        await product.save();
        msg.reply(`✅ Berhasil menambah akun utama untuk *${code}* dengan ${profileCount} profil.\n🔑 Sistem PIN Tetap telah diterapkan.`);
    } catch (err) {
        msg.reply('❌ Gagal menambah akun: ' + err.message);
    }
};

// 3. Menghapus Produk dari Database
const deleteProduct = async (msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('❌ Akses khusus admin.');
    
    const code = body.split(' ')[1]?.toUpperCase();
    if (!code) return msg.reply('⚠️ Format salah! Contoh: !del NFLX-1P1U');

    try {
        const result = await Product.findOneAndDelete({ code: code });
        if (!result) return msg.reply('❌ Produk dengan kode tersebut tidak ditemukan.');
        
        msg.reply(`✅ Produk *${code}* dan seluruh data akun di dalamnya berhasil dihapus.`);
    } catch (err) {
        msg.reply('❌ Terjadi kesalahan saat menghapus produk: ' + err.message);
    }
};

// 4. Konfirmasi Order Selesai (Kirim Detail Otomatis ke Pembeli)
const sendAccountDone = async (client, msg, body, isAdmin) => {
    if (!isAdmin) return msg.reply('❌ Akses khusus admin.');
    const args = body.split(' ');
    if (args.length < 3) return msg.reply('⚠️ Format: !done 0851xxx [KODE]');

    try {
        // Auto-Format Nomor HP (Ubah 08 jadi 628)
        let phone = args[1];
        if (phone.startsWith('0')) {
            phone = '62' + phone.slice(1);
        }
        const targetWa = phone.includes('@c.us') ? phone : `${phone}@c.us`;
        
        const code = args[2].toUpperCase();

        const product = await Product.findOne({ code: code });
        if (!product) return msg.reply('❌ Kode produk tidak ditemukan.');

        // Cari profil yang masih tersedia
        let selectedProfile = null;
        let selectedAccount = null;

        for (const acc of product.accounts) {
            const availableProf = acc.profiles.find(p => p.isAvailable);
            if (availableProf) {
                selectedProfile = availableProf;
                selectedAccount = acc;
                break;
            }
        }

        if (!selectedProfile) return msg.reply('❌ Stok profil untuk produk ini habis!');

        // Update status profil
        selectedProfile.isAvailable = false;
        selectedProfile.customerWa = targetWa;
        selectedProfile.expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 Hari
        selectedProfile.warrantyUntil = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000); // +23 Hari

        await product.save();

        let successMsg = `⋆𐙚 𝖮𝖱𝖣𝖤𝖱 𝖢𝖮𝖬𝖯𝖫𝖤𝖳𝖤 𐙚⋆\n`;
        successMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        successMsg += `Terima kasih sudah order di *Nanacy Store*!\n\n`;
        successMsg += `📧 *Email:* ${selectedAccount.email}\n`;
        successMsg += `🔑 *Pass:* ${selectedAccount.password}\n`;
        successMsg += `👤 *Profil:* ${selectedProfile.profileNumber}\n`;
        successMsg += `📌 *PIN:* ${selectedProfile.pin}\n\n`;
        successMsg += `📅 *Expired:* ${selectedProfile.expiredAt.toDateString()}\n`;
        successMsg += `🛡️ *Garansi:* s/d ${selectedProfile.warrantyUntil.toDateString()}\n\n`;
        successMsg += `⚠️ *Rules:* Dilarang ubah password/email & dilarang mengacak profil lain!`;

        // Bot otomatis mengirim WA ke nomor si pembeli
        await client.sendMessage(targetWa, successMsg);
        
        // Membalas ke chat admin untuk konfirmasi
        msg.reply(`✅ Akun Premium (Profil ${selectedProfile.profileNumber}) berhasil dikirim otomatis ke nomor ${phone}.`);
        
    } catch (err) {
        msg.reply('❌ Terjadi kesalahan: ' + err.message);
    }
};

module.exports = { addProduct, addAccount, deleteProduct, sendAccountDone };