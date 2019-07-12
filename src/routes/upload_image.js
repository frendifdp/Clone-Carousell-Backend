const controller = require('../controllers/upload_image');
const multer = require('multer');
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

const express 	= require('express');
const Route 	= express.Router();

Route
	.post('/', multerUploads, controller.uploadImages)

module.exports = Route;