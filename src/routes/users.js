'use strict'
const express = require('express');
const Route = express.Router();

const users 		= require('../controllers/users');

Route
	.get('/', users.getUsers)

module.exports = Route;