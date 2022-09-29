const express = require('express');
const route = express.Router();
const { getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/product');

route.get('/', getProduct);
route.post('/add_product', addProduct);
route.patch('/update_product/:id', updateProduct);
route.delete('/delete_product/:id', deleteProduct);

module.exports = route;