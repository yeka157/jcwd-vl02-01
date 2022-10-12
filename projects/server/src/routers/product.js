const express = require('express');
const route = express.Router();
const { countProduct, getProduct, addProduct, updateProduct, deleteProduct, getProductStock, updateProductStock, addProductStock, deleteProductStock, selectProduct, selectRandomProduct } = require('../controllers/product');
const { uploader } = require('../config/uploader');

const uploadProductImage = uploader('/imgProduct', 'IMGPRDCT').array('product_image', 1);

route.get('/', getProduct);
route.get('/count', countProduct);
route.get('/stock/:id', getProductStock);
route.get('/select/:id', selectProduct);
route.get('/random/:id', selectRandomProduct);

route.post('/add_product', uploadProductImage, addProduct);
route.post('/add_stock', addProductStock);

route.patch('/update_product/:id', uploadProductImage, updateProduct);
route.patch('/update_stock/:id', updateProductStock);

route.delete('/delete_product/:id', deleteProduct);
route.delete('/delete_stock/:id', deleteProductStock);

module.exports = route;