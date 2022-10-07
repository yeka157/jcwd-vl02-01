const express = require('express');
const { rajaOngkirController } = require('../controllers');
const route = express.Router();
const { readToken } = require('../config/encrypt');


route.get('/get_province', rajaOngkirController.getProvince);
route.post('/get_city', rajaOngkirController.getCity);
route.get('/get_delivery_option/:city_id', readToken, rajaOngkirController.delivery);


module.exports = route;