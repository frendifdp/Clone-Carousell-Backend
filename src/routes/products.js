<<<<<<< HEAD
=======
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

>>>>>>> origin/frendi
'use strict'
const express = require('express');
const Route = express.Router();

<<<<<<< HEAD
const users 		= require('../controllers/products');

Route
	// .get('/products', users.getProducts)

module.exports = Route;
=======
const controller 		= require('../controllers/products');

Route
    .get('/', controller.getProducts)
    .get('/:id', controller.getProduct)
    .post('/', controller.postProduct)
    // .put('/:id', controller.putProduct)
    .patch('/:id', controller.patchProduct)
    .delete('/:id', controller.delProduct)

module.exports = Route;

>>>>>>> origin/frendi
