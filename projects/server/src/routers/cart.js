const express = require('express');
const { readToken } = require('../config/encrypt');
const { cartController} = require('../controllers');
const route = express.Router();

route.get('/get_cart_data',readToken, cartController.getCart);
route.patch('/check_item/:cart_id', cartController.chekItem);
route.patch('/decrement_cart_qty/:cart_id', cartController.decrementCart);
route.patch('/increment_cart_qty/:cart_id', cartController.incrementCart);
route.delete('/delete_item/:cart_id', cartController.deleteItem);
route.get('/checkouted_item', readToken, cartController.getCheckedItem);
route.post('/add_cart', readToken, cartController.addCart);

module.exports = route;