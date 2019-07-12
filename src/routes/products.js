'use strict'
const express = require('express');
const Route = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

const controller 		= require('../controllers/products');

Route
    .get('/', controller.getProducts)
    .get('/:id', controller.getProduct)
    .get('/sub/:id', controller.getBySub)
    .get('/user/:id', controller.getByUser)
    .post('/', multerUploads, controller.postProduct)
    .patch('/:id', controller.patchProduct)
    .delete('/:id', controller.delProduct)

module.exports = Route;