'use strict'
const express 	= require('express');
const Route 	= express.Router();

const controller = require('../controllers/sub_category');

Route
	.get('/', controller.getSubCategory)
	.get('/:id', controller.getSubCategory)

module.exports = Route;