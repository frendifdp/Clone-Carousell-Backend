'use strict'
const express 	= require('express');
const Route	    = express.Router();

const wishlist	 = require('../controllers/wishlist');

Route
	.get('/', wishlist.getWishlist)
	// .post('/', users.createUsers)
	// .patch('/password/:id_user', users.changePassword)


module.exports = Route;