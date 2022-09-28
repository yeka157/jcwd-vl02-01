const express = require('express');
const { readToken } = require('../config/encrypt');
const { authController } = require('../controllers');
const route = express.Router();

route.post('/register', authController.register);
route.get('/get_all_users', authController.getUsers);
route.patch('/verify_account', readToken, authController.verify);
route.get('/send_email_verify', readToken, authController.verificationRequest);


module.exports = route;