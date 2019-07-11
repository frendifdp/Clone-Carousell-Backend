'use strict'
const express 	= require('express');
const Route 	= express.Router();

const controller = require('../controllers/forget_password');

Route
	.post('/', controller.sendEmail)
	.post('/pass', controller.resetPassword)

module.exports = Route;