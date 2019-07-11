'use strict'
const express 	= require('express');
const Route	    = express.Router();

const wishlist	 = require('../controllers/wishlist');

Route
	.get('/', wishlist.getWishlist)
	.post('/', wishlist.createWishlist)
	.delete('/', wishlist.deleteWishlist)


module.exports = Route;