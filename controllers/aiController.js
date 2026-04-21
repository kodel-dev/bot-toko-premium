const axios = require('axios'); 
const Product = require('../models/Product'); // Memastikan data stok diambil real-time dari database

// ==========================================
// 🧠 LOGIC TRAINING AI (PROMPT SYSTEM)
// ==========================================
const getSystemPrompt = (realTimeStock) => {
    return `
Kamu adalah "Nanacy AI", Customer Service pintar dan ramah dari "Nanacy Store".
Nanacy Store menjual layanan aplikasi premium seperti Netflix, Canva, Spotify, dll.

Gaya Bahasamu:
- Ramah, estetik, dan sopan. Gunakan emoji (🌸, ✨, 🛒).
- Selalu panggil pelanggan dengan sebutan "Kak".

Data Stok Real-Time Saat Ini (Langsung dari Database):
${realTimeStock}

Aturan Penting:
1. Jawab ketersediaan stok HANYA berdasarkan data di atas.
2. Jika stok "Habis", katakan sedang kosong.
3. Berikan instruksi order: "!order [kode_produk]".
    `;
};

// ==========================================
// ⚙️ MESIN UTAMA AI
// ==========================================
const askAI = async (msg, body) => {
    // Mengambil API Key dari .env yang sudah kamu setting
    const apiKey = process.env.GROQ_API_KEY; 

    const question = body.replace(/^(tanya ai|!tanya ai|!tanya|tanya cs)\s*/i, '').trim();

    if (!question) {
        return msg.reply(`🤖 *𝓝𝓪𝓷𝓪𝓬𝔂 𝓐𝓘 𝓐𝓼𝓼𝓲𝓼𝓽𝓪𝓷𝓽*\n\nAda yang bisa Nanacy bantu cek stoknya kak?\nFormat: *!tanya [pertanyaan]*`);
    }

    try {
        const chat = await msg.getChat();
        chat.sendStateTyping();

        // 1. AMBIL DATA STOK REAL-TIME DARI DATABASE
        const products = await Product.find();
        let realTimeStock = "";

        if (products.length === 0) {
            realTimeStock = "(Database toko masih kosong)";
        } else {
            products.forEach(p => {
                let availableStock = 0;
                let isAccountBased = p.accounts && p.accounts.length > 0;

                // Logika pengecekan stok profil (seperti Netflix/Spotify)
                if (isAccountBased) {
                    p.accounts.forEach(acc => {
                        if (acc.profiles) {
                            acc.profiles.forEach(prof => {
                                if (prof.isAvailable) availableStock++;
                            });
                        }
                    });
                }

                let stockStatus = isAccountBased 
                    ? (availableStock > 0 ? `${availableStock} Profil Tersedia` : `Habis`) 
                    : `Tersedia`;
                
                realTimeStock += `- ${p.name} | Kode: ${p.code} | Harga: Rp ${p.price.toLocaleString('id-ID')} | Stok: ${stockStatus}\n`;
            });
        }

        // 2. GABUNGKAN PROMPT DAN PERTANYAAN
        const systemPrompt = getSystemPrompt(realTimeStock);
        const fullContent = `SISTEM: ${systemPrompt}\n\nUSER: ${question}`;

        // 3. PANGGIL API SANKA
        const apiUrl = `https://www.sankavollerei.com/ai/arona`;
        const response = await axios.get(apiUrl, {
            params: {
                apikey: apiKey, // Menggunakan 'planaai' yang diambil dari .env
                text: fullContent
            }
        });

        const answer = response.data.result || 'Maaf kak, sistem Nanacy sedang gangguan. Coba lagi ya!';
        
        msg.reply(`🤖 *𝓝𝓪𝓷𝓪𝓬𝔂 𝓐𝓘 𝓐𝓼𝓼𝓲𝓼𝓽𝓪𝓷𝓽*\n\n${answer}`);

    } catch (error) {
        console.error('AI Controller Error:', error);
        msg.reply('❌ Maaf kak, server AI sedang gangguan. Silakan hubungi admin!');
    }
};

module.exports = { askAI };