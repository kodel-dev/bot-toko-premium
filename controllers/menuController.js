const showMenu = (client, sender, isAdmin) => {
    let menu = `⋆𐙚 𝖯𝖱𝖤𝖬𝖨𝖴𝖬 𝖲𝖳𝖮𝖱𝖤 𝖬𝖤𝖭𝖴 𐙚⋆\n`;
    menu += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
    menu += `Silakan pilih menu transaksi:\n`;
    menu += `🛒 *!list* : Lihat Katalog Produk\n`;
    menu += `🔎 *!detail [kode]* : Info Spesifik\n`;
    menu += `💳 *!order [kode]* : Formulir Pembelian\n`;
    menu += `🆘 *!help* : Pusat Bantuan\n`;
    
    if (isAdmin) {
        menu += `\n.✦ ݁˖ 𝖠𝖣𝖬𝖨𝖭 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣 🛠️ :\n`;
        menu += `➕ *!add* : Tambah/Update Produk\n`;
        menu += `🗑️ *!del* : Hapus Produk\n`;
        menu += `✅ *!done* : Template Selesai\n`;
    } else {
        menu += `\n👤 *Status:* Pelanggan`;
    }
    
    menu += `\n\n─────── ⋆⋅☆⋅⋆ ───────\n`;
    menu += `Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა`;

    client.sendMessage(sender, menu);
};

const showHelp = (client, sender, isAdmin) => {
    let helpMsg = '';

    // Jika yang mengetik adalah Admin
    if (isAdmin) {
        helpMsg += `⋆𐙚 𝖠𝖣𝖬𝖨𝖭 𝖧𝖤𝖫𝖯 𝖢𝖤𝖭𝖳𝖤𝖱 🛠️ 𐙚⋆\n`;
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        helpMsg += `🔸 *!add*\nMenambah/Update produk. Gunakan Enter/Baris Baru untuk tiap isian. Ketik *!add* untuk melihat contoh template-nya.\n\n`;
        helpMsg += `🔸 *!del [kode]*\nMenghapus produk dari database.\n\n`;
        helpMsg += `🔸 *!done [email]*\nMengirim template pesan format akun selesai diproses.\n\n`;
        helpMsg += `🔸 *Catatan:*\nAdmin tetap bisa menggunakan perintah pelanggan seperti *!list*, *payment*, dll.\n\n`;
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n`;
        helpMsg += `Semangat kerjanya, Admin! ૮꒰ ˶• ༝ •˶꒱ა`;
    } 
    // Jika yang mengetik adalah Pelanggan Biasa
    else {
        helpMsg += `⋆𐙚 𝖢𝖴𝖲𝖳𝖮𝖬𝖤𝖱 𝖧𝖤𝖫𝖯 𝖢𝖤𝖭𝖳𝖤𝖱 👤 𐙚⋆\n`;
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        helpMsg += `🔸 *!list*\nMelihat daftar seluruh produk & stok.\n\n`;
        helpMsg += `🔸 *!detail [kode]*\nMelihat deskripsi lengkap produk.\n_Contoh: !detail NFLX_\n\n`;
        helpMsg += `🔸 *!order [kode]*\nMembuat invoice tagihan pembelian.\n_Contoh: !order NFLX_\n\n`;
        helpMsg += `🔸 *payment*\nMenampilkan QRIS dan info rekening untuk pembayaran.\n\n`;
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n`;
        helpMsg += `Ada kendala? Silakan hubungi Admin.`;
    }

    client.sendMessage(sender, helpMsg);
};

module.exports = { showMenu, showHelp };