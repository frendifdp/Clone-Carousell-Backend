'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');




exports.getCheckout = function(req, res){

	const id_order 		= req.query.id_order;

	const query 		=  `SELECT *, product.product_name, product.price, address.address, payment_method.name_payment_method  FROM checkout
							INNER JOIN address ON checkout.id_address=address.id_address
							INNER JOIN product ON checkout.id_product=product.id_product
							INNER JOIN payment_method ON checkout.id_payment_method=payment_method.id_payment_method
							WHERE id_order=\'${id_order}\'`;
		connection.query(
			query,
			function(error, rows, field){
				if(error){
					console.log(error);
				}else{
					if(rows!=''){
						return res.send({
							data  : rows,
						})
					}else{
						return res.send({
							message:'Data not found',
						})
					}

				}

			}

		)
}


exports.createCheckout = function(req, res){
	// ambil data id_user, id_product, total_product, total_price dari table cart
	// ambil data id_order dari frontend
	const id_order 			= req.body.id_order;
	const id_user 			= req.body.id_user;
	const id_product 		= req.body.id_product;
	const total_product		= req.body.total_product;
	const id_address		= req.body.id_address;
	const total_price		= req.body.total_price;
	const id_payment_method	= req.body.id_payment_method;

	if(!id_user){
		res.status(400).send('Id User is require');
	}else if(!id_product){
		res.status(400).send('Id Product is require');
	}else if(!total_product){
		res.status(400).send('Total Product is require');
	}else if(!id_address){
		res.status(400).send('Id address is require');
	}else{ 
		const id_order = Math.random().toString(36).substring(2, 15);
		connection.query(
			`INSERT INTO checkout set id_order=\'${id_order}\', id_user=${id_user}, id_product=${id_product}, total_product=${total_product}, id_address=${id_address}, total_price=${total_price}, id_payment_method=${id_payment_method}`,
			function(error, rows, field){

			}
		)
		
	}
}


exports.deleteCheckout  = function(req, res, next){

	const id_user 	= parseInt(req.params.id_user);
	const id_order 	= parseInt(req.params.id_order);

	connection.query(
		`Delete from checkout where id_order=? AND id_user Limit 1`,
		[id_order, id_user],
		function(error, rows, field){
			if(error){
				throw error;
			}else{
				if(rows.affectedRows != ""){
					return res.send({
						message :'Data has been delete',
						data 	: {id_order, id_user}
					})
				}else{
					return res.status(400).send ({ 
						message : "Id not valid.",
					})
				}
			}
		}
	)
}