'use strict'
const express = require('express');
const Route = express.Router();

const users 		= require('../controllers/users');

Route
	// .get('/', users.getCheckout)
	// .post('/', users.createCheckout)
	// .patch('/:id_user', users.updateCheckout)

module.exports = Route;