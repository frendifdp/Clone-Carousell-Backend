// 'use strict'

// module.exports = function(app){
//     const controller = require('../controllers/products');
//     //GET
//     app.get('/products', controller.products);
//     app.get('/product/:id', controller.product);
//     //POST
//     app.post('/product', controller.newProduct);
//     //PUT
//     app.put('/product/:id', controller.updateProduct);
//     //DELETE
//     app.delete('/product/:id', controller.deleteProduct);

// }

'use strict'
const express = require('express');
const Route = express.Router();

const controller 		= require('../controllers/products');

Route
    .get('/products', controller.getProducts)
    // .get('/product/:id', controller.getProduct)
    // .post('/product', controller.postProduct)
    // .put('/product/:id', controller.putProduct)
    // .delete('/product/:id', controller.delProduct)

module.exports = Route;

