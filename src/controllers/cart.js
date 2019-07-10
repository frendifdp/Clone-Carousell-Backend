'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');



function getTime(){
	const today = new Date();
	const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	const dateTime = date+' '+time;
	return dateTime;

}

// console.log();


exports.getCart = function(req, res){

	const id 		= req.params.id_user || '';

	const query 		=  `SELECT *  FROM cart WHERE id_user=${id}  LIMIT 10`;
		connection.query(
			query,
			function(error, rows, field){
				if(error){
					console.log(error);
				}else{
					if(!id){
						res.status(400).send ({ message : 'Id User is require' });
					}else{
						if(rows!=''){
							return res.send({
								data  : rows,
							})
						}else{
							return res.send({
								message:'Cart not found',
							})
						}
					}

				}

			}

		)
}



exports.createCart = function(req, res){

	const id_user 		= req.params.id_user;
	const id_product 	= req.query.id_product;

	if(!id_user){
		res.status(400).send('Id User is require');
	}else if(!id_product){
		res.status(400).send('Password is require');
	}else{
			connection.query( //get data product
				`SELECT * from product WHERE id_product=${id_product} LIMIT 1`,
				function(error, rows, field){
					if(error){
						console.log(error);
					}else{
						const price 		= rows[0].price
						const dateTime 	= getTime();

						connection.query(
							`insert into cart set id_user=?, id_product=?, total_product=?, total_price=?, date_create=?`,
							[id_user, id_product, 1, price, dateTime ],
							function(error, rowss, field){
								if(error){
									console.log(error)
								}else{
									connection.query( // get data new insert
										`select * from cart WHERE id_user=${id_user} AND id_product=${id_product} ORDER BY date_create DESC LIMIT 1`,
										function(error, rowsss, field){
											if(error){
												console.log(error)
											}else{
												return res.send({
													data:rowsss
												})
											}
										}
									)
								}
							}
						)
					}
				}
			)
		}
	} //end 


exports.updateCart = function(req, res, next){

	const id_user 			= req.params.id_user;
	const id_product 		= req.query.id_product;
	
	connection.query(
		`select * from cart where id_user=? AND id_product=? Limit 1`,
		 [id_user, id_product],
		function(error, rows, field){
			if(error){
				throw error;
			}else{
				if(rows != ""){
					if(!id_user){
						res.status(400).send ({ message : 'Id User is require' });
					}else if(!id_product){
						res.status(400).send ({ message : 'Id Product is require' });
					}else{

						connection.query( //get data product
							`select * from product where id_product=${id_product} Limit 1`,
							function(error, rowss, field){
								if(error){
									throw error;
								}else{
									
									const total_product = rows[0].total_product + 1;
									const total_price 	= rows[0].total_price + rowss[0].price;
									const time 					= getTime();
									connection.query(
										`update cart set total_product=?, total_price=?, date_create=? where id_user=? AND id_product=? LIMIT 1`,
										[total_product, total_price, time, id_user, id_product],		
										function(error, rows, field){
											if(error){
												console.log(error);
											}else{
												connection.query(
													`select * from cart where id_user=? and id_product=? order by date_create desc limit 1`	,
													[id_user, id_product],
														function(error, rowsss, field){
															return res.send({
																data 		: rowsss,
																message : 'Data has been updated'
															})
									
														}
												)

											}
										}
									)
								}
							}
						)
					}
				}else{
					res.status(400).send ({ message : 'Id not valid.' })
				}
			}
		}
	)
}



exports.deleteCart = function(req, res, next){
	const id_user 		= req.params.id_user;
	const id_product 	= req.query.id_product;

	connection.query(
		`Delete from cart where id_user=? And id_product=? Limit 1`,
		[id_user, id_product],
		function(error, rows, field){
			if(error){
				throw error;
			}else{
				if(rows.affectedRows != ""){
					return res.send({
						message :'Data has been delete',
						data 		: {id_user, id_product}
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