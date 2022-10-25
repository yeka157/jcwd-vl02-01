const express = require('express');
const route = express.Router();
const { getCategory, addCategory, editCategory, deleteCategory } = require('../controllers/category');
const { readToken } = require('../config/encrypt');

route.get('/', getCategory);
route.post('/add_category', readToken, addCategory);
route.patch('/edit_category/:id', readToken, editCategory);
route.delete('/delete_category/:id', readToken, deleteCategory);

module.exports = route;
