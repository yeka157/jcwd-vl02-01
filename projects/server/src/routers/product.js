const express = require('express');
const route = express.Router();
const { countProduct, getProduct, addProduct, updateProduct, deleteProduct, getProductStock, updateProductStock, addProductStock, deleteProductStock, selectProduct, selectRandomProduct, selectBestSeller } = require('../controllers/product');
const { uploader } = require('../config/uploader');
const { readToken } = require('../config/encrypt');

const uploadProductImage = uploader('/imgProduct', 'IMGPRDCT').array('product_image', 1);

route.get('/', getProduct);
route.get('/count', countProduct);
route.get('/stock/:id', getProductStock);
route.get('/select/:id', selectProduct);
route.get('/random/:id', selectRandomProduct);
route.get('/bestseller', selectBestSeller);

route.post('/add_product', readToken, uploadProductImage, addProduct);
route.post('/add_stock', readToken, addProductStock);

route.patch('/update_product/:id', readToken, uploadProductImage, updateProduct);
route.patch('/update_stock/:id', readToken, updateProductStock);

route.delete('/delete_product/:id', readToken, deleteProduct);
route.delete('/delete_stock/:id', readToken, deleteProductStock);

module.exports = route;