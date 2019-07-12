'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');


exports.getWishlist = function(req, res){

	const id_user 		= req.query.id_user || '';
	const id_product 	= parseInt(req.query.id_product);

	if(id_user==''){
		connection.query(
			`SELECT wishlist.id_wishlist, wishlist.id_user, wishlist.id_product,wishlist.id_user, user.username, user.image, user.firstname, user.lastname  FROM wishlist
			LEFT JOIN user ON wishlist.id_user=user.id_user 
			WHERE wishlist.id_product=${id_product}`,
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
	}else{
		connection.query(
			`SELECT wishlist.id_wishlist, wishlist.id_user, wishlist.id_product, product.product_name, product.price, product.date_created, product.image, product.id_user as id_seller, user.username, user.image as user_image  FROM wishlist 
			LEFT JOIN product ON wishlist.id_product=product.id_product 
			LEFT JOIN user ON product.id_user=user.id_user
			WHERE wishlist.id_user=${id_user}`,
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

}




exports.createWishlist = function(req, res){

	const id_user 		= req.query.id_user;
	const id_product	= req.query.id_product;

	if(!id_user){
		res.status(400).send('Id User is require');
	}else if(!id_product){
		res.status(400).send('Id Product is require');
	}else{
		connection.query(
			`select * from wishlist where id_user=${id_user} AND id_product=${id_product} Limit 1`,
			function(error, rows, field){
				if(error){
					console.log(error)
				}else{
					if(rows==''){
						connection.query(
							`INSERT INTO wishlist set id_product=${id_product}, id_user=${id_user}`,
							function(error, rows, field){
								if(error){
									console.log(error)
								}else{
									connection.query(
										`select * from wishlist WHERE id_user=${id_user} ORDER BY id_wishlist DESC LIMIT 1`,
										function(error, rowss, field){
											if (error) {
												console.log(error)
											}else{
												return res.send({
													data: rowss
												})

											}
										}
									)
								}
							}
						)
					}else{
						connection.query(
							`Delete from wishlist where id_user=? And id_product=? Limit 1`,
							[id_user, id_product],
							function(error, rows, field){
								if(error){
									throw error;
								}else{
									if(rows.affectedRows != ""){
										return res.send({
											message :'Data has been delete',
											data 	: {id_user, id_product}
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
				}
			}
		) 
			
	}
}


exports.deleteWishlist  = function(req, res, next){
	const id_user 		= parseInt(req.query.id_user);
	const id_product 	= parseInt(req.query.id_product);

	connection.query(
		`Delete from wishlist where id_user=? And id_product=? Limit 1`,
		[id_user, id_product],
		function(error, rows, field){
			if(error){
				throw error;
			}else{
				if(rows.affectedRows != ""){
					return res.send({
						message :'Data has been delete',
						data 	: {id_user, id_product}
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