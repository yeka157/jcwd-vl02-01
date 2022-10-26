const express = require('express');
const { adminController } = require('../controllers');
const route = express.Router();

route.get('/get_stock_history', adminController.getStockHistory);
route.get('/total_stock_history', adminController.getTotalData);
route.get('/get_transaction_report', adminController.getTransactionReport);
route.get('/get_transaction_table', adminController.getTransactionTable);
route.get('/get_product_report', adminController.getProductReport);
route.get('/get_product_table', adminController.getProductTable);
route.get('/get_user_report', adminController.getUserReport);
route.get('/get_user_table', adminController.getUserTable);
route.get('/total_report', adminController.getTotalReport);

module.exports = route;