const mongoose = require('mongoose');

// Skema untuk masing-masing profil dalam satu akun Netflix
const profileSchema = new mongoose.Schema({
    profileNumber: { type: Number, required: true }, // Contoh: Profil 1, 2, 3, 4, 5
    pin: { type: String, required: true },
    customerWa: { type: String, default: null }, // Nomor WA pembeli yang menempati profil
    planDurationDays: { type: Number, default: 30 }, // Durasi paket (contoh: 30 hari)
    expiredAt: { type: Date, default: null }, // Tanggal langganan pembeli habis
    warrantyUntil: { type: Date, default: null }, // Batas garansi untuk pembeli ini
    isAvailable: { type: Boolean, default: true } // Status ketersediaan (True jika belum terjual)
});

// Skema untuk Akun Netflix utama (Kredensial asli dari First Hand)
const accountSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    makerExpiredAt: { type: Date, required: true }, // Tanggal akun mati dari maker/first hand
    profiles: [profileSchema] // Array berisi profil-profil di atas
});

// Skema Katalog Produk Utama
const productSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Contoh: NFLX-1P1U-1B
    name: { type: String, required: true }, // Contoh: Netflix 1P1U 1 Bulan
    category: { type: String, required: true }, // Kategori: 1p1u, 1p2u, semi-private, private
    isStrong: { type: Boolean, default: false }, // Penanda apakah akun tipe strong
    price: { type: Number, required: true }, // Harga Jual ke pelanggan (Mark-up)
    modalPrice: { type: Number, required: true }, // Harga Modal (HPP) dari First Hand
    description: { type: String },
    accounts: [accountSchema] // Semua stok akun Netflix dimasukkan ke sini
});

module.exports = mongoose.model('Product', productSchema);