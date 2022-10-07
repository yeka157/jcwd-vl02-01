const express = require('express');
const route = express.Router();
const { countProduct, getProduct, getProductStock, addProduct, updateProduct, deleteProduct } = require('../controllers/product');

route.get('/', getProduct);
route.get('/count', countProduct);
route.get('/stock/:id', getProductStock);
route.post('/add_product', addProduct);
route.patch('/update_product/:id', updateProduct);
route.delete('/delete_product/:id', deleteProduct);

module.exports = route;