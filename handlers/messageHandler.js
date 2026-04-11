// Import semua controller
const { showMenu, showHelp } = require('../controllers/menuController');
const { listProducts, detailProduct, sendPricelist } = require('../controllers/productController');
const { addProduct, addAccount, deleteProduct, sendAccountDone } = require('../controllers/adminController');
const { orderProduct } = require('../controllers/orderController');
const { sendPaymentQR } = require('../controllers/paymentController');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase().trim();
    
    // Pisahkan ID ruang chat dan ID nomor HP asli
    const sender = msg.from; 
    const userPhone = msg.author || msg.from; 

    // FITUR: Log Sender
    console.log(`[LOG] Pesan Masuk | User: ${userPhone} | Msg: ${body}`);

    // Filter Admin Cerdas
    const adminEnv = process.env.ADMIN_NUMBERS || "";
    const adminNumbers = adminEnv.split(',').map(n => n.trim());
    const isAdmin = adminNumbers.some(adminID => userPhone.includes(adminID));

    // ==========================================
    // DETEKSI OTOMATIS: KIRIM GAMBAR PRICELIST
    // ==========================================
    const appKeywords = [
        'adobe', 'alightmotion', 'apple', 'bstation', 'canva', 'capcut', 'chatgpt',
        'claude', 'dazzcam', 'deepl', 'disney', 'dramabox', 'duolingo', 'gemini',
        'getcontact', 'hbo', 'iqiyi', 'loklok', 'meitu', 'melolo', 'netflix',
        'picsart', 'polar', 'prime', 'remini', 'robux', 'spotify', 'vidio', 'viu',
        'wattpad', 'wetv', 'wink', 'youtube', 'zoom'
    ];

    // Cek apakah pesan user adalah nama aplikasi (contoh: "wink" atau "!wink")
    const isAppRequest = appKeywords.find(app => lowerBody === app || lowerBody === `!${app}`);
    
    if (isAppRequest) {
        const appName = isAppRequest.replace('!', ''); // Bersihkan tanda seru jika ada
        return await sendPricelist(client, msg, sender, appName);
    }

    // ==========================================
    // ROUTING PESAN MENU & TRANSAKSI
    // ==========================================
    if (['menu', 'p', 'halo', '!menu'].includes(lowerBody)) {
        return showMenu(client, sender, isAdmin);
    } 
    else if (lowerBody.startsWith('!help') || lowerBody === 'help') {
        return showHelp(client, sender, isAdmin);
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
    
    // ==========================================
    // BAGIAN KHUSUS ADMIN (NETFLIX DATABASE)
    // ==========================================
    else if (lowerBody.startsWith('!addacc ') || lowerBody.startsWith('!addaccount ')) {
        return await addAccount(msg, body, isAdmin);
    }
    else if (lowerBody.startsWith('!add ')) {
        return await addProduct(msg, body, isAdmin);
    } 
    else if (lowerBody.startsWith('!del ')) {
        return await deleteProduct(msg, body, isAdmin);
    } 
    else if (lowerBody.startsWith('!done ')) {
        return await sendAccountDone(client, msg, body, isAdmin);
    }
    
    // ==========================================
    // BAGIAN CHECKOUT DATABASE
    // ==========================================
    else if (lowerBody.startsWith('!order ')) {
        return await orderProduct(client, msg, body, sender);
    }
};

module.exports = { handleMessage };