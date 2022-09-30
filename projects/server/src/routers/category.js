const express = require('express');
const route = express.Router();
const { getCategory, addCategory, editCategory, deleteCategory } = require('../controllers/category');

route.get('/', getCategory);
route.post('/add_category', addCategory);
route.patch('/edit_category/:id', editCategory);
route.delete('/delete_category/:id', deleteCategory);

module.exports = route;
