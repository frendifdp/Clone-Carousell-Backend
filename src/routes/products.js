
'use strict'
const express = require('express');
const Route = express.Router();

const controller 		= require('../controllers/products');

Route
    .get('/', controller.getProducts)
    .get('/:id', controller.getProduct)
    .post('/', controller.postProduct)
    .patch('/:id', controller.patchProduct)
    .delete('/:id', controller.delProduct)

module.exports = Route;