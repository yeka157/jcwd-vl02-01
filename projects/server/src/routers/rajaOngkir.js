const express = require('express');
const { readToken } = require('../config/encrypt');
const { rajaOngkirController } = require('../controllers');
const route = express.Router();

route.get('/get_delivery_option', readToken, rajaOngkirController.delivery);

module.exports = route;