'use strict'
const express 	= require('express');
const Route 	= express.Router();

const cart 		= require('../controllers/cart');


Route.get('/:id_user', cart.getCart) //get cart by user_id
Route.post('/:id_user', cart.createCart) //insert and update
Route.delete('/:id_user', cart.deleteCart)

module.exports = Route;