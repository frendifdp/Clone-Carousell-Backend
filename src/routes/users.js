'use strict'
const express = require('express');
const Route = express.Router();

const users 		= require('../controllers/users');

Route
	.get('/', users.getUsers)
	.post('/', users.createUsers)
	.patch('/:id_user', users.updateUsers)

	.patch('/password/:id_user', users.changePassword)


module.exports = Route;