const express = require('express');
const { readToken } = require('../config/encrypt');
const { userController } = require('../controllers');
const { uploader } = require('../config/uploader');
const route = express.Router();

const uploadFile = uploader('/imgProfile', 'IMGPRFL').array('images', 1);

route.patch('/update_profile', readToken, userController.updateProfile);
route.patch('/update_picture', readToken, uploadFile, userController.updatePicture);
route.post('/add_address/:id',  userController.addAddress);
route.patch('/edit_address/:id', userController.editAddress);
route.delete('/delete_address/:id', userController.deleteAddress);

module.exports = route;