'use strict'
const express = require('express');
const Route = express.Router();

const checkout 		= require('../controllers/checkout');

Route
	.get('/', checkout.getCheckout)
	.post('/', checkout.createCheckout)
	.delete('/', checkout.deleteCheckout)

module.exports = Route;