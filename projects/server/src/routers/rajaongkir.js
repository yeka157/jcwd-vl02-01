const express = require('express');
const { rajaOngkirController } = require('../controllers');
const route = express.Router();

route.get('/get_province', rajaOngkirController.getProvince);
route.post('/get_city', rajaOngkirController.getCity);

module.exports = route;