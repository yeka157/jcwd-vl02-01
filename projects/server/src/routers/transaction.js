const express = require('express');
const { readToken } = require('../config/encrypt');
const { transactionController } = require('../controllers');
const route = express.Router();
const { uploader } = require('../config/uploader');

const uploadFile = uploader('/imgPrescription', 'IMGGPRES').array('image', 1);

route.post('/add_custom_transaction', readToken, uploadFile, transactionController.addCustomTransaction);
route.post('/add_transaction', readToken, transactionController.addTransaction);


module.exports = route;