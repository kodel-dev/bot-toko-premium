    const Product = require('../models/Product');
require('dotenv').config();

// [GET] API Katalog: Untuk Mitra mengambil daftar harga dan stok terbaru
const getKatalog = async (req, res) => {
    try {
        const products = await Product.find();
        
        const catalog = products.map(p => {
            let availableStock = 0;
            if (p.accounts && p.accounts.length > 0) {
                p.accounts.forEach(acc => {
                    if (acc.profiles && acc.profiles.length > 0) {
                        acc.profiles.forEach(prof => {
                            if (prof.isAvailable) availableStock++;
                        });
                    }
                });
            }

            return {
                kode_produk: p.code,
                nama_produk: p.name,
                kategori: p.category,
                harga_reseller: p.modalPrice + 2000, // Contoh: Harga modal + Mark up khusus mitra
                stok_tersedia: availableStock
            };
        });

        res.status(200).json({
            status: "success",
            message: "Berhasil mengambil katalog",
            data: catalog
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

// [POST] API Order: Untuk Mitra melakukan order otomatis (Memotong stok DB & Auto-Kirim WA)
const prosesOrderMitra = async (req, res, client) => {
    // Validasi API Key (Agar tidak sembarang orang bisa tembak API)
    const { api_key, kode_produk, nomor_wa_pembeli } = req.body;

    if (api_key !== process.env.MITRA_API_KEY) {
        return res.status(401).json({ status: "error", message: "API Key tidak valid!" });
    }

    if (!kode_produk || !nomor_wa_pembeli) {
        return res.status(400).json({ status: "error", message: "Parameter kode_produk dan nomor_wa_pembeli wajib diisi." });
    }

    try {
        const code = kode_produk.toUpperCase();
        const product = await Product.findOne({ code: code });

        if (!product) {
            return res.status(404).json({ status: "error", message: "Kode produk tidak ditemukan." });
        }

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

        if (!selectedProfile) {
            return res.status(400).json({ status: "error", message: "Stok profil untuk produk ini habis!" });
        }

        // Format nomor WA Pembeli (Ubah 08 jadi 628)
        let phone = nomor_wa_pembeli.toString();
        if (phone.startsWith('0')) {
            phone = '62' + phone.slice(1);
        }
        const targetWa = phone.includes('@c.us') ? phone : `${phone}@c.us`;

        // Kunci/Update profil menjadi terjual
        selectedProfile.isAvailable = false;
        selectedProfile.customerWa = targetWa;
        selectedProfile.expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
        selectedProfile.warrantyUntil = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000); 

        await product.save();

        // Siapkan format pesan sukses untuk dikirim ke nomor pembeli
        let successMsg = `⋆𐙚 𝖮𝖱𝖣𝖤𝖱 𝖢𝖮𝖬𝖯𝖫𝖤𝖳𝖤 𐙚⋆\n`;
        successMsg += `─────── ⋆⋅☆⋅⋆ ───────\n\n`;
        successMsg += `Pesanan *${product.name}* via Mitra berhasil diproses!\n\n`;
        successMsg += `📧 *Email:* ${selectedAccount.email}\n`;
        successMsg += `🔑 *Pass:* ${selectedAccount.password}\n`;
        successMsg += `👤 *Profil:* ${selectedProfile.profileNumber}\n`;
        successMsg += `📌 *PIN:* ${selectedProfile.pin}\n\n`;
        successMsg += `📅 *Expired:* ${selectedProfile.expiredAt.toDateString()}\n`;
        successMsg += `🛡️ *Garansi:* s/d ${selectedProfile.warrantyUntil.toDateString()}\n\n`;
        successMsg += `⚠️ *Rules:* Dilarang ubah password/email & dilarang mengacak profil lain!`;

        // Bot otomatis mengirim WA ke nomor si pembeli
        await client.sendMessage(targetWa, successMsg);

        // Kembalikan Response JSON Sukses ke Server Mitra
        res.status(200).json({
            status: "success",
            message: "Order berhasil. Detail akun telah dikirim ke WhatsApp pembeli.",
            detail_akun: {
                email: selectedAccount.email,
                password: selectedAccount.password,
                profil: selectedProfile.profileNumber,
                pin: selectedProfile.pin,
                expired: selectedProfile.expiredAt
            }
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = { getKatalog, prosesOrderMitra };