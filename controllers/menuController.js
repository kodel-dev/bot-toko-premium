const showMenu = (client, sender, isAdmin) => {
    let menu = `👑 *PREMIUM STORE MANAGER* 👑\n\n`;
    menu += `Silakan pilih menu transaksi:\n`;
    menu += `🛒 *!list* : Lihat Katalog Produk\n`;
    menu += `🔎 *!detail [kode]* : Info Spesifik Produk\n`;
    menu += `💳 *!order [kode]* : Formulir Pembelian\n`;
    menu += `🆘 *!help* : Pusat Bantuan & Panduan\n`;
    
    if (isAdmin) {
        menu += `\n🛠️ *DASHBOARD ADMIN (CRUD)* \n`;
        menu += `➕ *!add* : Tambah/Update Produk\n`;
        menu += `🗑️ *!del* : Hapus Produk\n`;
    } else {
        menu += `\n👤 *Status:* Pelanggan`;
    }
    
    client.sendMessage(sender, menu);
};

const showHelp = (client, sender, isAdmin) => {
    let helpMsg = `🌟 *PUSAT BANTUAN PREMIUM STORE* 🌟\n\n`;
    helpMsg += `Berikut adalah panduan lengkap menggunakan layanan bot kami:\n\n`;
    
    helpMsg += `👤 *PANDUAN PELANGGAN:*\n`;
    helpMsg += `🔸 *!list*\nMenampilkan seluruh produk yang tersedia beserta harga dan stoknya.\n\n`;
    helpMsg += `🔸 *!detail [kode]*\nMenampilkan deskripsi lengkap dari suatu produk. \n_Contoh: !detail NFLX_\n\n`;
    helpMsg += `🔸 *!order [kode]*\nMembuat pesanan dan mendapatkan rincian pembayaran. \n_Contoh: !order NFLX_\n\n`;

    if (isAdmin) {
        helpMsg += `🛠️ *PANDUAN ADMIN:*\n`;
        helpMsg += `🔸 *!add KODE|NAMA|HARGA|DESKRIPSI|STOK*\nMenambahkan atau memperbarui produk. Wajib dipisah dengan tanda garis vertikal (|).\n_Contoh: !add NFLX|Netflix Premium|35000|Akun VIP 1 Bulan|10_\n\n`;
        helpMsg += `🔸 *!del [kode]*\nMenghapus produk dari database secara permanen. \n_Contoh: !del NFLX_\n\n`;
    }

    helpMsg += `💡 *Catatan:* Pastikan mengetik kode produk dengan benar sesuai yang ada di katalog (!list).`;

    client.sendMessage(sender, helpMsg);
};

module.exports = { showMenu, showHelp };