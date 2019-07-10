'use strict'
const express 	= require('express');
const Route 	= express.Router();

const cart 		= require('../controllers/cart');

Route
	.get('/:id_user', cart.getCart) //get cart by user_id
	.post('/:id_user', cart.createCart)
	.patch('/:id_user', cart.updateCart)

module.exports = Route;