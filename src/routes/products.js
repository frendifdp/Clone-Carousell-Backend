'use strict'

module.exports = function(app){
    const controller = require('../controllers/products');
    //GET
    app.get('/products', controller.products);
    app.get('/product/:id', controller.product);
    //POST
    app.post('/product', controller.newProduct);
    //PUT
    app.put('/product/:id', controller.updateProduct);
    //DELETE
    app.delete('/product/:id', controller.deleteProduct);

}