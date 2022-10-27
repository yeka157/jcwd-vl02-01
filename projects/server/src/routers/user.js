const express = require('express');
const { readToken } = require('../config/encrypt');
const { userController } = require('../controllers');
const { uploader } = require('../config/uploader');
const route = express.Router();

const uploadFile = uploader('/imgProfile', 'IMGPRFL').array('images', 1);

route.patch('/update_profile', readToken, userController.updateProfile);
route.patch('/update_picture', readToken, uploadFile, userController.updatePicture);
route.post('/add_address', readToken,  userController.addAddress);
route.patch('/edit_address/:id', readToken, userController.editAddress);
route.patch('/edit_main_address/:id', readToken, userController.changeMainAddress);
route.delete('/delete_address/:id', readToken, userController.deleteAddress);
route.get('/get_address', readToken, userController.getAddress);
route.get('/get_main_address', readToken, userController.getMainAddress);
route.post('/add_address_delivery', readToken, userController.addAddressDelivery)


module.exports = route;