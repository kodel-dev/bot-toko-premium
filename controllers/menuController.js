const { Buttons } = require('whatsapp-web.js');

const showMenu = (client, sender, isAdmin) => {
    let bodyText = `꣑꣒‎ ˚𝒽𝑒𝓁𝓁𝑜𝓌 @everyone 𝅄 ׅ\n`;
    bodyText += `𝅄 ◌ 𐔌 𝗉𝗂𝗅𝗂𝗁 𝗆𝖾𝗇𝗎 𝗍𝗋𝖺𝗇𝗌𝖺𝗄𝗌𝗂𝗆𝗎 ⠟\n\n`;
    bodyText += `Pusat aplikasi premium dengan pelayanan terbaik. Silakan klik tombol di bawah ini untuk melihat Katalog Produk, Metode Pembayaran, atau Bantuan! 👇`;

    // Merakit Tombol (Maksimal 3 tombol)
    // Ketika tombol diklik, user seolah-olah mengetik teks yang ada di 'body'
    let buttons = new Buttons(
        bodyText, 
        [
            { body: '!list' },     // Tombol 1
            { body: 'payment' },   // Tombol 2
            { body: '!help' }      // Tombol 3
        ], 
        '✨ 𝓝𝓪𝓷𝓪𝓬𝔂 𝓢𝓽𝓸𝓻𝓮 ✨', // Judul Atas
        'Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა' // Teks Bawah
    );

    // Kirim pesan tombol
    client.sendMessage(sender, buttons);

    // Khusus admin, kita kirimkan pesan teks tambahan untuk command admin 
    // (Karena command admin terlalu banyak untuk dimasukkan ke tombol)
    if (isAdmin) {
        let adminMenu = `\n╭ ۫─┄─┈ ִ ׄ⑅ 𝓐𝗱𝗺𝗶𝗻 𝗗𝗮𝘀𝗵𝗯𝗼𝗮𝗿𝗱 ׄ⑅ ──┈\n`;
        adminMenu += `┃ ➕ *!add* : Buat Kategori\n`;
        adminMenu += `┃ 📥 *!addacc* : Input Stok\n`;
        adminMenu += `┃ 🗑️ *!del* : Hapus Produk\n`;
        adminMenu += `┃ ✅ *!done* : Kirim ke Pembeli\n`;
        adminMenu += `╰ ۫─┈ ִ─┄─┈──┄─────┈`;
        client.sendMessage(sender, adminMenu);
    }
};

const showHelp = (client, sender, isAdmin) => {
    let helpMsg = '';

    if (isAdmin) {
        helpMsg += `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
        helpMsg += `✨ 𝓐𝓭𝓶𝓲𝓷 𝓗𝓮𝓵𝓹 𝓒𝓮𝓷𝓽𝓮𝓻 ✨\n`;
        helpMsg += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n\n`;
        helpMsg += `🔸 *!add [kode] [nama] [kategori] [hjual] [hmodal]*\n`;
        helpMsg += `Membuat kategori produk.\n`;
        helpMsg += `_Cth: !add CNV-1B Canva_Premium 1bulan 10000 5000_\n\n`;
        helpMsg += `🔸 *!addacc [kode] [email] [pass] [tgl_exp] [jml_profil] [ops: pin]*\n`;
        helpMsg += `Memasukkan stok akun sharing (Seperti Netflix).\n`;
        helpMsg += `_Cth: !addacc NFLX-1P1U nanacy@gmail.com pass123 2026-05-10 5_\n\n`;
        helpMsg += `🔸 *!del [kode]*\n`;
        helpMsg += `Menghapus produk & stoknya.\n\n`;
        helpMsg += `🔸 *!done [nomor_wa] [kode]*\n`;
        helpMsg += `Mengirim detail akun ke pembeli (Bot Auto Chat).\n`;
        helpMsg += `_Cth: !done 08516253xxx NFLX-1P1U_\n\n`;
        helpMsg += ` ꒰ ֹ ֪ ⊹ Semangat kerjanya, Admin! ૮꒰ ˶• ༝ •˶꒱ა`;
    } 
    else {
        helpMsg += `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
        helpMsg += `✨ 𝓒𝓾𝓼𝓽𝓸𝓶𝓮𝓻 𝓗𝓮𝓵𝓹 𝓒𝓮𝓷𝓽𝓮𝓻 ✨\n`;
        helpMsg += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n\n`;
        helpMsg += `🔸 *!list*\n`;
        helpMsg += `Melihat daftar produk & stok.\n\n`;
        helpMsg += `🔸 *[Nama Aplikasi]* (Pencarian Otomatis)\n`;
        helpMsg += `Ketik nama aplikasi untuk lihat gambar pricelist.\n`;
        helpMsg += `_Contoh: ketik *wink* atau *netflix*_\n\n`;
        helpMsg += `🔸 *!order [kode]*\n`;
        helpMsg += `Membuat invoice pembelian berdasarkan kode.\n`;
        helpMsg += `_Contoh: !order NFLX-1P1U_\n\n`;
        helpMsg += `🔸 *payment*\n`;
        helpMsg += `Melihat QRIS/Rekening.\n\n`;
        helpMsg += ` ꒰ ֹ ֪ ⊹ Ada kendala? Silakan hubungi Admin.`;
    }

    client.sendMessage(sender, helpMsg);
};

module.exports = { showMenu, showHelp };