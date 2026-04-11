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
    } else {
        menu += `\n👤 *Status:* Pelanggan`;
    }
    
    menu += `\n\n─────── ⋆⋅☆⋅⋆ ───────\n`;
    menu += `Happy Shopping, Sunshine! ૮꒰ ˶• ༝ •˶꒱ა`;

    client.sendMessage(sender, menu);
};

const showHelp = (client, sender, isAdmin) => {
    let helpMsg = `⋆𐙚 𝖧𝖤𝖫𝖯 𝖢𝖤𝖭𝖳𝖤𝖱 𐙚⋆\n`;
    helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
    
    helpMsg += `.✦ ݁˖ 𝖢𝖴𝖲𝖳𝖮𝖬𝖤𝖱 𝖦𝖴𝖨𝖣𝖤 👤 :\n`;
    helpMsg += `🔸 *!list*\nLihat semua produk & stok.\n\n`;
    helpMsg += `🔸 *!detail [kode]*\nCek deskripsi lengkap.\n_Contoh: !detail NFLX_\n\n`;
    helpMsg += `🔸 *!order [kode]*\nBuat invoice pembelian.\n_Contoh: !order NFLX_\n\n`;

    if (isAdmin) {
        helpMsg += `.✦ ݁˖ 𝖠𝖣𝖬𝖨𝖭 𝖦𝖴𝖨𝖣𝖤 🛠️ :\n`;
        helpMsg += `🔸 *!add KODE|NAMA|HARGA|DESC|STOK*\n_Contoh: !add NFLX|Netflix|35k|VIP|10_\n\n`;
        helpMsg += `🔸 *!del [kode]*\nHapus produk.\n\n`;
    }

    helpMsg += `─────── ⋆⋅☆⋅⋆ ───────\n`;
    helpMsg += `Ada kendala? Hubungi Admin.`;

    client.sendMessage(sender, helpMsg);
};

module.exports = { showMenu, showHelp };