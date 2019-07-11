'use strict'
const express 	= require('express');
const Route 	= express.Router();

const controller = require('../controllers/forget_password');

Route
	.post('/', controller.sendEmail)

module.exports = Route;