'use strict'
const express = require('express');
const Route = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
const users 		= require('../controllers/users');

Route
	.get('/', users.getUsers)
	.post('/', multerUploads, users.createUsers)
	.patch('/:id_user', users.updateUsers)

	.patch('/password/:id_user', users.changePassword)


module.exports = Route;