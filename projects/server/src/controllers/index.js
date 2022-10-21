const authController = require('./auth');
const userController = require('./user');
const categoryController = require('./category');
const rajaOngkirController = (require('./rajaongkir'));
const productController =  require('./product');
const transactionController = require('./transaction');
const cartController = require('./cart')
const adminController = require('./admin');

module.exports = {
    authController,
    userController,
    categoryController,
    rajaOngkirController,
    productController,
    transactionController,
    cartController,
    adminController
}