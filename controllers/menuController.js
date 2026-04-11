const showMenu = (client, sender, isAdmin) => {
    let menu = `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
    menu += `✨ 𝓝𝓪𝓷𝓪𝓬𝔂 𝓢𝓽𝓸𝓻𝓮 𝓜𝓮𝓷𝓾 ✨\n`;
    menu += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n`;
    menu += `꣑꣒‎ ˚𝒽𝑒𝓁𝓁𝑜𝓌 𝅄 ׅ\n`;
    menu += `𝅄 ◌ 𐔌 𝗉𝗂𝗅𝗂𝗁 𝗆𝖾𝗇𝗎 𝗍𝗋𝖺𝗇𝗌𝖺𝗄𝗌𝗂𝗆𝗎 ⠟\n\n`;

    menu += `╭ ۫─┄─┈ ִ ׄ⑅ 𝓣𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 ׄ⑅ ──┈\n`;
    menu += `┃ 🛒 *!list* : Lihat Katalog Lengkap\n`;
    menu += `┃ 🔎 *[nama apk]* : Cek Harga (Cth: wink)\n`;
    menu += `┃ 💳 *!order [kode]* : Beli Produk\n`;
    menu += `┃ 💸 *payment* : Info QRIS & Rekening\n`;
    menu += `┃ 🆘 *!help* : Pusat Bantuan\n`;
    menu += `╰ ۫─┈ ִ─┄─┈──┄─────┈\n`;
    
    if (isAdmin) {
        menu += `\n╭ ۫─┄─┈ ִ ׄ⑅ 𝓐𝗱𝗺𝗶𝗻 𝗗𝗮𝘀𝗵𝗯𝗼𝗮𝗿𝗱 ׄ⑅ ──┈\n`;
        menu += `┃ ➕ *!add* : Buat Kategori Produk\n`;
        menu += `┃ 📥 *!addacc* : Input Stok Akun\n`;
        menu += `┃ 🗑️ *!del* : Hapus Produk & Stok\n`;
        menu += `┃ ✅ *!done* : Kirim Akun ke Pembeli\n`;
        menu += `╰ ۫─┈ ִ─┄─┈──┄─────┈\n`;
    } else {
        menu += `\n👤 *Status:* Pelanggan`;
    }
    
    menu += `\n ꒰ ֹ ֪ ⊹ 𝗅𝗂𝗍𝗍𝗅𝖾 𝗇𝗈𝗍𝖾𝖽 ꕀ 𖦹 ࣪⡾ \n`;
    menu += `Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა`;

    client.sendMessage(sender, menu);
};

const showHelp = (client, sender, isAdmin) => {
    let helpMsg = '';

    // Jika yang mengetik adalah Admin
    if (isAdmin) {
        helpMsg += `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
        helpMsg += `✨ 𝓐𝓭𝓶𝓲𝓷 𝓗𝓮𝓵𝓹 𝓒𝓮𝓷𝓽𝓮𝓻 ✨\n`;
        helpMsg += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n\n`;
        
        helpMsg += `🔸 *!add [kode] [nama] [kategori] [hjual] [hmodal]*\n`;
        helpMsg += `Membuat cangkang/kategori produk baru (Berlaku Universal).\n`;
        helpMsg += `_Contoh: !add CNV-1B Canva_Premium 1bulan 10000 5000_\n\n`;
        
        helpMsg += `🔸 *!addacc [kode] [email] [pass] [tgl_exp] [jml_profil] [opsional: pin1,pin2...]*\n`;
        helpMsg += `Memasukkan stok akun sharing (Seperti Netflix). PIN otomatis berulang atau gunakan custom PIN di akhir.\n`;
        helpMsg += `_Contoh: !addacc NFLX-1P1U nanacy@gmail.com pass123 2026-05-10 5_\n\n`;

        helpMsg += `🔸 *!del [kode]*\n`;
        helpMsg += `Menghapus produk beserta seluruh stok akun di dalamnya dari database.\n`;
        helpMsg += `_Contoh: !del NFLX-1P1U_\n\n`;

        helpMsg += `🔸 *!done [nomor_wa] [kode]*\n`;
        helpMsg += `Mencari profil kosong, mengirim detail akun ke pembeli, dan mengaktifkan masa garansinya.\n`;
        helpMsg += `_Contoh: !done 08516253xxx NFLX-1P1U_\n\n`;

        helpMsg += `🔸 *Catatan:*\nAdmin tetap bisa menggunakan perintah pelanggan seperti *!list*, *payment*, dll.\n\n`;
        
        helpMsg += ` ꒰ ֹ ֪ ⊹ Semangat kerjanya, Admin! ૮꒰ ˶• ༝ •˶꒱ა`;
    } 
    // Jika yang mengetik adalah Pelanggan Biasa
    else {
        helpMsg += `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
        helpMsg += `✨ 𝓒𝓾𝓼𝓽𝓸𝓶𝓮𝓻 𝓗𝓮𝓵𝓹 𝓒𝓮𝓷𝓽𝓮𝓻 ✨\n`;
        helpMsg += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n\n`;
        
        helpMsg += `🔸 *!list*\n`;
        helpMsg += `Melihat daftar seluruh produk & ketersediaan stok di toko kami.\n\n`;
        
        helpMsg += `🔸 *[Nama Aplikasi]* (Pencarian Otomatis)\n`;
        helpMsg += `Ketik nama aplikasi untuk melihat pricelist, gambar, dan detail produk.\n`;
        helpMsg += `_Contoh: ketik *wink* atau *netflix*_\n\n`;
        
        helpMsg += `🔸 *!order [kode]*\n`;
        helpMsg += `Membuat invoice tagihan pembelian berdasarkan kode produk.\n`;
        helpMsg += `_Contoh: !order NFLX-1P1U_\n\n`;
        
        helpMsg += `🔸 *payment*\n`;
        helpMsg += `Menampilkan QRIS dan info rekening untuk proses pembayaran.\n\n`;
        
        helpMsg += ` ꒰ ֹ ֪ ⊹ Ada kendala? Silakan hubungi Admin.`;
    }

    client.sendMessage(sender, helpMsg);
};

module.exports = { showMenu, showHelp };