// Import semua controller yang sudah dipisah
const { showMenu } = require('../controllers/menuController');
const { listProducts, detailProduct } = require('../controllers/productController');
const { addProduct, deleteProduct } = require('../controllers/adminController');
const { orderProduct } = require('../controllers/orderController');

const handleMessage = async (client, msg) => {
    const body = msg.body;
    const lowerBody = body.toLowerCase();
    const sender = msg.from;

    // Filter Admin Cerdas
    const adminEnv = process.env.ADMIN_NUMBERS || "";
    const adminNumbers = adminEnv.split(',').map(n => n.trim());
    const isAdmin = adminNumbers.some(adminID => sender.includes(adminID));

    // ROUTING PESAN KE CONTROLLER MASING-MASING
    if ['menu', 'p', 'halo', 'help'].includes(lowerBody)) {
        return showMenu(client, sender, isAdmin);
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
    else if (lowerBody.startsWith('!order ')) {
        return await orderProduct(client, msg, body, sender);
    }
};

module.exports = { handleMessage };