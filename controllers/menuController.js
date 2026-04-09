const showMenu = (client, sender, isAdmin) => {
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
};

module.exports = { showMenu };