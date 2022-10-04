const express = require('express');
const { readToken } = require('../config/encrypt');
const { userController } = require('../controllers');
const route = express.Router();

route.patch('/update_profile', readToken, userController.updateProfile);
route.patch('/update_picture', userController.updatePicture);
route.post('/add_address/:id',  userController.addAddress);
route.patch('/edit_address/:id', userController.editAddress);
route.delete('/delete_address/:id', userController.deleteAddress);

module.exports = route;