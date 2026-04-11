const Groq = require('groq-sdk');

const askAI = async (msg, body) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return msg.reply('❌ Sistem AI belum dikonfigurasi oleh Admin (API Key Groq tidak ditemukan di .env).');

    const groq = new Groq({ apiKey: apiKey });
    
    // Menghapus keyword pemanggil untuk mendapatkan pertanyaan murninya
    const question = body.replace(/^(tanya ai|!tanya ai|!tanya|tanya cs)\s*/i, '').trim();

    // Jika pelanggan hanya mengklik tombol "Tanya CS (AI)" tanpa memberikan pertanyaan
    if (!question) {
        let introMsg = `🤖 *𝓝𝓪𝓷𝓪𝓬𝔂 𝓐𝓘 𝓐𝓼𝓼𝓲𝓼𝓽𝓪𝓷𝓽*\n\n`;
        introMsg += `Halo kak! Aku asisten AI dari Nanacy Store. Ada yang bingung dan mau ditanyakan seputar produk atau cara order?\n\n`;
        introMsg += `_Ketik pesannya dengan format:_\n`;
        introMsg += `*!tanya [pertanyaan kakak]*\n\n`;
        introMsg += `Contoh: *!tanya bedanya netflix 1p1u sama 1p2u apa ya?*`;
        return msg.reply(introMsg);
    }

    try {
        // Memberi tahu pengguna bahwa AI sedang mengetik/memproses (opsional, sebagai feedback)
        const chat = await msg.getChat();
        chat.sendStateTyping();

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Kamu adalah Customer Service (CS) AI dari "Nanacy Store", sebuah toko yang menjual aplikasi premium (Netflix, Canva, Wink, Spotify, dll). Jawab pertanyaan pelanggan dengan gaya bahasa estetik, ramah, kekinian, gunakan emoji, dan informatif. Panggil pelanggan dengan sebutan "Kak". Jika mereka bertanya harga, arahkan untuk mengetik nama aplikasinya langsung (contoh: "ketik aja netflix kak"). Jika mereka mau bayar, arahkan mengetik "payment". Jangan berikan jawaban yang terlalu panjang, buatlah singkat dan jelas.'
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            // Menggunakan LLaMA 3 dari Groq karena super cepat dan cerdas
            model: 'llama3-8b-8192', 
            temperature: 0.7,
        });

        const answer = chatCompletion.choices[0]?.message?.content || 'Maaf kak, sistem pikiranku lagi sedikit error nih. Coba tanya lagi ya!';
        
        msg.reply(`🤖 *𝓝𝓪𝓷𝓪𝓬𝔂 𝓐𝓘 𝓐𝓼𝓼𝓲𝓼𝓽𝓪𝓷𝓽*\n\n${answer}`);
    } catch (error) {
        console.error('Groq Error:', error);
        msg.reply('❌ Maaf kak, server AI kami sedang gangguan. Silakan hubungi admin langsung ya!');
    }
};

module.exports = { askAI };