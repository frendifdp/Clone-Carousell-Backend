'use strict'
const express = require('express');
const Route = express.Router();

const checkout 		= require('../controllers/checkout');

Route
	.get('/', checkout.getCheckout)
	.post('/', checkout.createCheckout)
	// .patch('/:id_user', users.updateCheckout)

module.exports = Route;