// Import semua controller
const { showMenu, showHelp } = require('../controllers/menuController');
const { listProducts, detailProduct } = require('../controllers/productController');
const { addProduct, deleteProduct, sendAccountDone } = require('../controllers/adminController');
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
    const isAdmin = adminNumbers.some(adminID => userPhone.includes(adminID));

    // ROUTING PESAN KE CONTROLLER MASING-MASING
    if (['menu', 'p', 'halo'].includes(lowerBody)) {
        return showMenu(client, sender, isAdmin);
    } 
    // PERBAIKAN: Gunakan startsWith agar !help admin atau !help saja tetap merespons
    else if (lowerBody.startsWith('!help') || lowerBody.startsWith('help')) {
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
};

module.exports = { handleMessage };