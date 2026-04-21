const Groq = require('groq-sdk');
const Product = require('../models/Product'); // Memanggil Database untuk dibaca oleh AI

// ==========================================
// 🧠 LOGIC TRAINING AI (PROMPT SYSTEM)
// ==========================================
// Bagian ini adalah "Otak" AI. Kamu bisa mengedit teks di bawah ini 
// untuk melatih gaya bicara atau menambah aturan baru untuk AI kamu.
const getSystemPrompt = (realTimeStock) => {
    return `
Kamu adalah "Nanacy AI", Customer Service pintar dan ramah dari "Nanacy Store".
Nanacy Store adalah toko terpercaya yang menjual layanan aplikasi premium seperti Netflix, Canva, Wink, Spotify, dll.

Gaya Bahasamu:
- Ramah, estetik, kekinian, dan sangat sopan.
- Gunakan emoji yang lucu dan relevan (🌸, ✨, 🛒, 💖, 🤖).
- Selalu panggil pelanggan dengan sebutan "Kak".
- Jawab dengan singkat, padat, jelas, dan tidak kaku seperti robot.

Aturan Navigasi:
1. Jika pelanggan bertanya cara order, arahkan untuk ketik: "!order [kode_produk]".
2. Jika pelanggan bertanya metode pembayaran, arahkan untuk ketik: "payment".
3. Jika pelanggan bertanya daftar harga/katalog, arahkan ketik: "!list".
4. Jika pelanggan bertanya pricelist spesifik (misal harga Canva), arahkan untuk mengetik nama aplikasinya langsung (contoh: "Ketik *canva* aja kak").

Data Katalog & Stok Real-Time Saat Ini:
Berikut adalah data langsung dari database toko. Gunakan data ini untuk menjawab jika pelanggan bertanya tentang harga, kode produk, atau sisa stok. Jika produk tidak ada di data ini, sampaikan bahwa produk sedang kosong/tidak tersedia.

${realTimeStock}
    `;
};

// ==========================================
// ⚙️ MESIN UTAMA AI (EKSEKUSI)
// ==========================================
const askAI = async (msg, body) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return msg.reply('❌ Sistem AI belum dikonfigurasi oleh Admin (API Key Groq tidak ditemukan di .env).');

    const groq = new Groq({ apiKey: apiKey });
    
    // Menghapus keyword pemanggil untuk mendapatkan pertanyaan murninya
    const question = body.replace(/^(tanya ai|!tanya ai|!tanya|tanya cs)\s*/i, '').trim();

    // Jika pelanggan hanya mengetik "!tanya" tanpa pertanyaan
    if (!question) {
        let introMsg = `🤖 *𝓝𝓪𝓷𝓪𝓬𝔂 𝓐𝓘 𝓐𝓼𝓼𝓲𝓼𝓽𝓪𝓷𝓽*\n\n`;
        introMsg += `Halo kak! Aku asisten AI dari Nanacy Store. Ada yang bingung dan mau ditanyakan seputar produk atau sisa stok?\n\n`;
        introMsg += `_Ketik pesannya dengan format:_\n`;
        introMsg += `*!tanya [pertanyaan kakak]*\n\n`;
        introMsg += `Contoh: *!tanya kak netflix 1p1u sisa berapa profil ya?*`;
        return msg.reply(introMsg);
    }

    try {
        const chat = await msg.getChat();
        chat.sendStateTyping();

        // 1. TAHAP PERTAMA: Ambil Semua Data Stok dari Database
        const products = await Product.find();
        let realTimeStock = "";

        if (products.length === 0) {
            realTimeStock = "(Saat ini database sedang kosong/belum ada produk)";
        } else {
            // Merangkum data produk menjadi teks yang bisa dibaca AI
            products.forEach(p => {
                let availableStock = 0;
                let hasProfiles = false;
                
                if (p.accounts && p.accounts.length > 0) {
                    hasProfiles = true;
                    p.accounts.forEach(acc => {
                        if (acc.profiles && acc.profiles.length > 0) {
                            acc.profiles.forEach(prof => {
                                if (prof.isAvailable) availableStock++;
                            });
                        }
                    });
                }

                // Status stok: Jika itu aplikasi sharing (Netflix) tampilkan angka, jika reguler tampilkan "Tersedia"
                let stockStatus = hasProfiles ? (availableStock > 0 ? `${availableStock} Profil Tersedia` : `Habis`) : `Tersedia`;
                
                realTimeStock += `- Nama: ${p.name} | Kode: ${p.code} | Harga: Rp ${p.price.toLocaleString('id-ID')} | Sisa Stok: ${stockStatus}\n`;
            });
        }

        // 2. TAHAP KEDUA: Gabungkan Logic Training (Prompt) dengan Data Real-Time
        const finalPrompt = getSystemPrompt(realTimeStock);

        // 3. TAHAP KETIGA: Kirim ke Otak Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: finalPrompt },
                { role: 'user', content: question }
            ],
            model: 'llama-3.1-8b-instant', 
            temperature: 0.7, // Tingkat kreativitas AI (0.0 kaku, 1.0 sangat imajinatif)
        });

        const answer = chatCompletion.choices[0]?.message?.content || 'Maaf kak, sistem pikiranku lagi sedikit error nih. Coba tanya lagi ya!';
        
        msg.reply(`🤖 *𝓝𝓪𝓷𝓪𝓬𝔂 𝓐𝓘 𝓐𝓼𝓼𝓲𝓼𝓽𝓪𝓷𝓽*\n\n${answer}`);
    } catch (error) {
        console.error('Groq Error:', error);
        msg.reply('❌ Maaf kak, server AI kami sedang gangguan. Silakan hubungi admin langsung ya!');
    }
};

module.exports = { askAI };