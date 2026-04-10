// Import semua controller
const { showMenu, showHelp } = require('../controllers/menuController');
const { listProducts, detailProduct } = require('../controllers/productController');
const { addProduct, deleteProduct, sendAccountDone } = require('../controllers/adminController');
const { orderProduct } = require('../controllers/orderController');
const { sendPaymentQR } = require('../controllers/paymentController');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase();
    const sender = msg.from;

    // Filter Admin Cerdas
    const adminEnv = process.env.ADMIN_NUMBERS || "";
    const adminNumbers = adminEnv.split(',').map(n => n.trim());
    const isAdmin = adminNumbers.some(adminID => sender.includes(adminID));

    // ROUTING PESAN KE CONTROLLER MASING-MASING
    if (['menu', 'p', 'halo'].includes(lowerBody)) {
        return showMenu(client, sender, isAdmin);
    } 
    else if (['!help', 'help'].includes(lowerBody)) {
        return showHelp(client, sender, isAdmin);
    }
    // Fitur Baru: Deteksi kata "payment" untuk kirim QR
    else if (lowerBody === 'payment' || lowerBody === '!payment') {
        return await sendPaymentQR(client, msg, sender);
    }
    else if (lowerBody === '!list') {
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
    // Fitur Baru: Template Done dari Admin
    else if (lowerBody.startsWith('!done ')) {
        return await sendAccountDone(msg, body, isAdmin);
    }
    else if (lowerBody.startsWith('!order ')) {
        return await orderProduct(client, msg, body, sender);
    }
};

module.exports = { handleMessage };