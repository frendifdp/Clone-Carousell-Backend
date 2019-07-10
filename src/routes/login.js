'use strict'
const express = require('express');
const Route = express.Router();

const controller 		= require('../controllers/login');

Route
    .get('/', controller.login)

module.exports = Route;