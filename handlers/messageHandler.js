// Import semua controller
const { showMenu, showHelp } = require('../controllers/menuController');
const { listProducts, detailProduct, sendPricelist } = require('../controllers/productController');
const { addProduct, deleteProduct, sendAccountDone } = require('../controllers/adminController');
const { orderProduct } = require('../controllers/orderController');
const { sendPaymentQR } = require('../controllers/paymentController');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase();
    
    const sender = msg.from; 
    const userPhone = msg.author || msg.from; 

    console.log(`[LOG] Pesan Masuk | User: ${userPhone} | Msg: ${body}`);

    const adminEnv = process.env.ADMIN_NUMBERS || "";
    const adminNumbers = adminEnv.split(',').map(n => n.trim());
    const isAdmin = adminNumbers.some(adminID => userPhone.includes(adminID));

    // Daftar Kata Kunci Produk untuk Auto-Kirim Gambar Pricelist
    const appKeywords = [
        'adobe', 'alightmotion', 'apple', 'bstation', 'camscanner', 'canva', 'capcut', 
        'chatgpt', 'claude', 'dazzcam', 'deepl', 'disney', 'dramaboss', 'dramabox', 
        'duolingo', 'gagaoolala', 'gemini', 'getcontact', 'hbo', 'iqiyi', 'loklok', 
        'meitu', 'melolo', 'netflix', 'picsart', 'polar', 'prime', 'reelshort', 
        'remini', 'robux', 'spotify', 'vidio', 'viu', 'wattpad', 'wetv', 'wink', 'youtube', 'zoom'
    ];

    // ROUTING PESAN
    if (['menu', 'p', 'halo'].includes(lowerBody)) {
        return showMenu(client, sender, isAdmin);
    } 
    else if (lowerBody.startsWith('!help') || lowerBody.startsWith('help')) {
        return showHelp(client, sender, isAdmin);
    }
    // COMMAND TESTER: !welcome (Menampilkan Nama + Nanacy Store)
    else if (lowerBody === '!welcome') {
        const contact = await msg.getContact();
        const displayName = contact.pushname || contact.name || "Kakak";

        let welcomeMsg = `🌸៶៶ ✦⭒ ── 🌱 ── ⭒ ✦ ៶៶ 🌸\n`;
        welcomeMsg += `✨ 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓽𝓸 nαnα𝖼𝗒 𝗌𝗍o𝗋𝖾 ✨\n`;
        welcomeMsg += `⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒ ── ⭒\n`;
        welcomeMsg += `꣑꣒‎ ˚𝒽𝑒𝓁𝓁𝑜𝓌 ${displayName} 𝅄 ׅ\n`;
        welcomeMsg += `𝅄 ◌ 𐔌 𝗍𝗁𝗂𝗌 𝗂𝗌 𝖺𝖻𝗈𝗎𝗍 𝗅𝗂𝗌𝗍 𝗉𝗋𝗈𝖽𝗎𝗄 ⠟\n`;
        welcomeMsg += `  .𝓒.𝗼𝗻𝘁𝗮𝗰𝘁 — owner 波\n`;
        welcomeMsg += `. ╰ link bio / chat admin ╯\n`;
        welcomeMsg += ` 𝅄 ◌ 𝗉𝗋𝖾𝗆𝗂𝗎𝗆 𝖺𝗉𝗉𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎 ٠𖹭\n\n`;
        welcomeMsg += `💡 _Ketik *!list* untuk melihat katalog._`;
        
        return await client.sendMessage(sender, welcomeMsg);
    }
    else if (lowerBody === 'payment' || lowerBody === '!payment') {
        return await sendPaymentQR(client, msg, sender);
    }
    else if (lowerBody === '!list' || lowerBody === 'list') {
        return await listProducts(msg);
    } 
    else if (lowerBody.startsWith('!detail ')) {
        return await detailProduct(msg, body);
    } 
    else if (lowerBody.startsWith('!add')) {
        return await addProduct(msg, body, isAdmin);
    } 
    else if (lowerBody.startsWith('!del')) {
        return await deleteProduct(msg, body, isAdmin);
    } 
    else if (lowerBody.startsWith('!done ')) {
        return await sendAccountDone(msg, body, isAdmin);
    }
    else if (lowerBody.startsWith('!order ')) {
        return await orderProduct(client, msg, body, sender);
    }
    // FITUR DETEKSI KEYWORD APP UNTUK FOTO PRICELIST
    else if (appKeywords.includes(lowerBody)) {
        return await sendPricelist(client, msg, sender, lowerBody);
    }
};

module.exports = { handleMessage };