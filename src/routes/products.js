'use strict'
const express = require('express');
const Route = express.Router();

const users 		= require('../controllers/products');

Route
	// .get('/products', users.getProducts)

module.exports = Route;