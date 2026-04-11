const showMenu = (client, sender, isAdmin) => {
    let menu = `⋆𐙚 𝖭𝖠𝖭𝖠𝖢𝖸 𝖲𝖳𝖮𝖱𝖤 𝖬𝖤𝖭𝖴 𐙚⋆\n`;
    menu += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
    menu += `Silakan pilih menu transaksi:\n`;
    menu += `🛒 *!list* : Lihat Katalog Produk\n`;
    menu += `🔎 *!detail [kode]* : Info Spesifik\n`;
    menu += `💳 *!order [kode]* : Formulir Pembelian\n`;
    menu += `💸 *payment* : Info Pembayaran / QRIS\n`;
    menu += `🆘 *!help* : Pusat Bantuan\n`;
    
    if (isAdmin) {
        menu += `\n.✦ ݁˖ 𝖠𝖣𝖬𝖨𝖭 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣 🛠️ :\n`;
        menu += `➕ *!add* : Buat Kategori Produk\n`;
        menu += `📥 *!addacc* : Input Stok Akun Netflix\n`;
        menu += `🗑️ *!del* : Hapus Produk & Akun\n`;
        menu += `✅ *!done* : Kirim Akun ke Pembeli\n`;
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
        
        helpMsg += `🔸 *!add [kode] [nama] [kategori] [hjual] [hmodal]*\n`;
        helpMsg += `Membuat cangkang/kategori produk baru.\n`;
        helpMsg += `_Contoh: !add NFLX-1P1U Netflix_1P_1U 1p1u 25000 14800_\n\n`;
        
        helpMsg += `🔸 *!addacc [kode] [email] [pass] [tgl_exp] [jml_profil] [opsional: pin1,pin2...]*\n`;
        helpMsg += `Memasukkan stok akun dari maker. PIN otomatis berulang (1111, 2222) atau gunakan custom PIN di akhir.\n`;
        helpMsg += `_Contoh (Default): !addacc NFLX-1P1U nanacy@gmail.com pass123 2026-05-10 5_\n`;
        helpMsg += `_Contoh (Custom PIN): !addacc NFLX-1P1U nanacy@gmail.com pass123 2026-05-10 5 1423,5512,9921_\n\n`;

        helpMsg += `🔸 *!del [kode]*\n`;
        helpMsg += `Menghapus produk beserta seluruh stok akun di dalamnya dari database.\n`;
        helpMsg += `_Contoh: !del NFLX-1P1U_\n\n`;

        helpMsg += `🔸 *!done [nomor_wa] [kode]*\n`;
        helpMsg += `Mencari profil kosong, mengirim detail akun ke pembeli, dan mengaktifkan masa garansinya.\n`;
        helpMsg += `_Contoh: !done 08516253xxx NFLX-1P1U_\n\n`;

        helpMsg += `🔸 *Catatan:*\nAdmin tetap bisa menggunakan perintah pelanggan seperti *!list*, *payment*, dll.\n\n`;
        
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n`;
        helpMsg += `Semangat kerjanya, Admin! ૮꒰ ˶• ༝ •˶꒱ა`;
    } 
    // Jika yang mengetik adalah Pelanggan Biasa
    else {
        helpMsg += `⋆𐙚 𝖢𝖴𝖲𝖳𝖮𝖬𝖤𝖱 𝖧𝖤𝖫𝖯 𝖢𝖤𝖭𝖳𝖤𝖱 👤 𐙚⋆\n`;
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        
        helpMsg += `🔸 *!list*\n`;
        helpMsg += `Melihat daftar seluruh produk & ketersediaan stok.\n\n`;
        
        helpMsg += `🔸 *!detail [kode]*\n`;
        helpMsg += `Melihat deskripsi lengkap produk.\n`;
        helpMsg += `_Contoh: !detail NFLX-1P1U_\n\n`;
        
        helpMsg += `🔸 *!order [kode]*\n`;
        helpMsg += `Membuat invoice tagihan pembelian.\n`;
        helpMsg += `_Contoh: !order NFLX-1P1U_\n\n`;
        
        helpMsg += `🔸 *payment*\n`;
        helpMsg += `Menampilkan QRIS dan info rekening untuk proses pembayaran.\n\n`;
        
        helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n`;
        helpMsg += `Ada kendala? Silakan hubungi Admin.`;
    }

    client.sendMessage(sender, helpMsg);
};

module.exports = { showMenu, showHelp };