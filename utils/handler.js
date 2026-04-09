const Product = require('../models/Product');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase();
    const sender = msg.from; // ID pengirim asli dari WhatsApp

    // 1. AMBIL & BERSIHKAN DAFTAR ADMIN DARI .ENV
    const adminEnv = process.env.ADMIN_NUMBERS || "";
// Ambil daftar admin dan bersihkan spasi
const adminNumbers = process.env.ADMIN_NUMBERS ? process.env.ADMIN_NUMBERS.split(',').map(n => n.trim()) : [];

// Cek apakah ID pengirim (sender) ada di dalam daftar adminNumbers
// Kita pakai .some agar lebih fleksibel
const isAdmin = adminNumbers.some(adminID => sender.includes(adminID));

    // ============================================================
    // DEBUG LOG - LIHAT HASIL INI DI TERMINAL KAMU
    // ============================================================
    console.log('--- DEBUG INFO ---');
    console.log('ID Pengirim (Sender):', sender); 
    console.log('Daftar Admin di .env:', adminNumbers);
    console.log('Status Admin:', isAdmin ? 'Dikenali (✅)' : 'Tidak Dikenal (❌)');
    console.log('------------------');
    // ============================================================

    // MENU UTAMA
    if (['menu', 'p', 'halo', 'help'].includes(lowerBody)) {
        let menu = `✨ *PREMIUM STORE BOT* ✨\n\n`;
        menu += `👉 *!list* : Lihat semua produk\n`;
        menu += `👉 *!order [kode]* : Cara beli\n`;
        
        if (isAdmin) {
            menu += `\n🛠️ *DASHBOARD ADMIN* \n`;
            menu += `Ketik *!add* untuk tutorial input barang.`;
        } else {
            menu += `\n👤 *STATUS:* Pelanggan`;
        }
        
        client.sendMessage(sender, menu);
    }

    // LOGIKA !ADD (KHUSUS ADMIN)
    else if (lowerBody.startsWith('!add')) {
        if (!isAdmin) {
            return msg.reply('❌ Maaf, nomor Anda tidak terdaftar sebagai Admin di file .env.');
        }

        const args = body.slice(5).split('|');

        if (args.length < 5) {
            let helpAdd = `📝 *TUTORIAL INPUT PRODUK* 📝\n\n`;
            helpAdd += `Gunakan format:\n*!add KODE|NAMA|HARGA|KET|STOK*\n\n`;
            helpAdd += `Contoh:\n_!add NFLX|Netflix|35000|Sharing|10_`;
            return msg.reply(helpAdd);
        }

        try {
            const code = args[0].trim().toUpperCase();
            const name = args[1].trim();
            const price = parseInt(args[2].trim().replace(/\D/g, ''));
            const desc = args[3].trim();
            const stock = parseInt(args[4].trim().replace(/\D/g, ''));

            await Product.findOneAndUpdate(
                { code: code },
                { name, price, description: desc, stock },
                { upsert: true, new: true }
            );

            msg.reply(`✅ *BERHASIL!* Produk *${name}* tersimpan.`);
        } catch (err) {
            msg.reply('❌ Gagal simpan. Cek format angka.');
        }
    }

    // LIST PRODUK
    else if (lowerBody === '!list') {
        const products = await Product.find();
        if (products.length === 0) return msg.reply('Stok kosong.');
        let listMsg = `📋 *PRICELIST* 📋\n\n`;
        products.forEach(p => {
            listMsg += `🏷️ *${p.name}* (${p.code})\n💰 Rp ${p.price.toLocaleString('id-ID')}\n📦 Stok: ${p.stock}\n---\n`;
        });
        msg.reply(listMsg);
    }
};

module.exports = { handleMessage };