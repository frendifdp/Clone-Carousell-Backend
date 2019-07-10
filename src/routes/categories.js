'use strict'
const express 	= require('express');
const Route 	= express.Router();

const cart 		= require('../controllers/categories');

Route
	.get('/', cart.getCategory)

module.exports = Route;