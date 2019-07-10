'use strict'
const express = require('express');
const Route = express.Router();

const controller 		= require('../controllers/login');

Route
    .post('/', controller.login)

module.exports = Route;