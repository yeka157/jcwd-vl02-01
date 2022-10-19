const express = require('express');
const { adminController } = require('../controllers');
const route = express.Router();

route.get('/get_stock_history', adminController.getStockHistory);
route.get('/total_stock_history', adminController.getTotalData);

module.exports = route;