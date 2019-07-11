'use strict'
const express = require('express');
const Route = express.Router();

const controller 		= require('../controllers/products');

Route
    .get('/', controller.getProducts)
    .get('/:id', controller.getProduct)
    .get('/sub/:id', controller.getBySub)
    .get('/user/:id', controller.getByUser)
    .post('/', controller.postProduct)
    .patch('/:id', controller.patchProduct)
    .delete('/:id', controller.delProduct)

module.exports = Route;