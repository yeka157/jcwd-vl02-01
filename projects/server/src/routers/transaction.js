const express = require('express');
const { readToken } = require('../config/encrypt');
const { transactionController } = require('../controllers');
const route = express.Router();
const { uploader } = require('../config/uploader');

const uploadFile = uploader('/imgPrescription', 'IMGGPRES').array('image', 1);
const uploadProof = uploader('/imgPayment', 'IMGPROOF').array('image', 1);

route.post('/add_custom_transaction', readToken, uploadFile, transactionController.addCustomTransaction);
route.post('/add_transaction', readToken, transactionController.addTransaction);

route.get('/get_transaction', readToken, transactionController.getTransactions);
route.get('/count', readToken, transactionController.countTransactionLIst);
route.get('/transaction_detail/:transaction_id', transactionController.getTransactionDetail);

route.patch('/confirm_prescription/:product_id',readToken, transactionController.handleDoctorPrescription);
route.patch('/substract_stock/:stock_id', transactionController.substractStock);
route.patch('/update_status/:transaction_id', transactionController.updateStatus);
route.patch('/update_total_purchase/:transaction_id', readToken, transactionController.updateTotalPurchase);
route.patch('/upload_payment_proof/:transaction_id', uploadProof, transactionController.uploadPAymentProof);
route.patch('/stock_recovery/:product_id', uploadProof, transactionController.stockRecovery);

module.exports = route;