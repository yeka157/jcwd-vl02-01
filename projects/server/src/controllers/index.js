const authController = require('./auth');
const userController = require('./user');
const categoryController = require('./category');
const cartController = require('./cart');
const rajaOngkirController = (require('./rajaongkir'));
const productController =  require('./product');


module.exports = {
    authController,
    userController,
    categoryController,
    cartController,
    rajaOngkirController,
    productController,
}