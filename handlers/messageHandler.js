// Import semua controller
const { showMenu, showHelp } = require('../controllers/menuController');
const { listProducts, detailProduct } = require('../controllers/productController');
const { addProduct, addAccount, deleteProduct, sendAccountDone } = require('../controllers/adminController');
const { orderProduct } = require('../controllers/orderController');
const { sendPaymentQR } = require('../controllers/paymentController');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase();
    
    // Pisahkan ID ruang chat dan ID nomor HP asli
    const sender = msg.from; 
    const userPhone = msg.author || msg.from; 

    // FITUR: Log Sender
    console.log(`[LOG] Pesan Masuk | User: ${userPhone} | Msg: ${body}`);

    // Filter Admin Cerdas
    const adminEnv = process.env.ADMIN_NUMBERS || "";
    const adminNumbers = adminEnv.split(',').map(n => n.trim());
    
    // Deteksi apakah pengirim adalah admin (boolean)
    const isAdmin = adminNumbers.some(adminID => userPhone.includes(adminID));

    // ROUTING PESAN KE CONTROLLER MASING-MASING
    if (['menu', 'p', 'halo', '!menu'].includes(lowerBody)) {
        return showMenu(client, sender, isAdmin);
    } 
    // Deteksi menu Help dengan pemisahan admin dan user biasa
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
    // Bagian khusus Admin
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
        // PERBAIKAN: Kirim 'client' agar fungsi ini bisa mengeksekusi pengiriman pesan ke pembeli
        return await sendAccountDone(client, msg, body, isAdmin);
    }
    // Bagian Checkout Pembeli
    else if (lowerBody.startsWith('!order ')) {
        return await orderProduct(client, msg, body, sender);
    }
};

module.exports = { handleMessage };