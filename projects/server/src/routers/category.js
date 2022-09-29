const express = require('express');
const route = express.Router();
const { getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category');

route.get('/', getCategory);
route.post('/create_category', createCategory);
route.patch('/update_category/:category_name', updateCategory);
route.delete('/delete_category/:category_name', deleteCategory);

module.exports = route;
