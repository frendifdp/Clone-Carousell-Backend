'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');


exports.getWishlist = function(req, res){

	const id_user 		= req.query.id_user || '';
	const id_product 	= req.query.id_product;

	const query 		=  `SELECT *  FROM wishlist WHERE id_product=${id_product} AND id_user=${id_user} LIMIT 10`;
		connection.query(
			query,
			function(error, rows, field){
				if(error){
					console.log(error);
				}else{
					if(rows!=''){
						return res.send({
							data  : rows[0],
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




// exports.createUsers = function(req, res){

// 	const user 		= req.body.username;
// 	const password 	= encrypt(req.body.password);
// 	const email		= req.body.email;

// 	if(!user){
// 		res.status(400).send('username is require');
// 	}else if(!password){
// 		res.status(400).send('Password is require');
// 	}else if(!email){
// 		res.status(400).send('Email is require');
// 	}else{ 
// 	//cek username, email ada yang sama gak
// 		connection.query(
// 			`SELECT * from user where username=\'${user}\' LIMIT 1`,
// 			function(error, rows, field){
// 				if(error){
// 					console.log('cuy ' +error)
// 				}else{

// 					if(rows!=''){
// 						return res.send({
// 							message: 'Username is exist'
// 						})
// 					}else{
// 						connection.query(
// 							`SELECT * from user where email=\'${email}\' LIMIT 1`,
// 							function(error, rowss, field){
// 								if(error){
// 									console.log(error)
// 								}else{
// 									if(rowss!=''){
// 										return res.send({
// 											message: 'Email has been registered'
// 										})
// 									}else{
// 										connection.query( //insert
// 											`Insert into user set username=?, password=?, email=?`,
// 											[user, password, email],
// 											function(error, rowsss, field){
// 												if(error){
// 													console.log(error);
// 												}else{
// 													connection.query(
// 														`SELECT *  FROM user ORDER BY id_user DESC LIMIT 1`, function(error, rowssss, field){
// 															if(error){
// 																console.log(error);
// 															}else{
// 																return res.send({
// 																	data 	: rowssss,
// 																	message : "Data has been saved"
// 																})
// 															}
// 														}
// 													)
// 												}
// 											}
// 										)
// 									}
// 								}
// 							}
// 						)
// 					}
// 				}
// 			}
// 		)
// 	}
// }


// exports.updateUsers = function(req, res, next){

// 	const id 			= req.params.id_user;
// 	const username 		= req.body.username;
// 	const firstname 	= req.body.firstname || null;
// 	const lastname		= req.body.lastname || null;
// 	const hp			= req.body.hp || null;
// 	const gender		= req.body.gender || null;
// 	const birth			= req.body.birth || null;
// 	const image			= req.body.image || null;

// 	connection.query(
// 		`select * from user where id_user=?`,[id],
// 		function(error, rows, field){
// 			if(error){
// 				throw error;
// 			}else{
// 				if(rows != ""){
// 					if(!username){
// 						res.status(400).send ({ message : 'Username is require' });
// 					}else{
// 						console.log(birth)
// 						connection.query(
// 							`Update user set username=?, firstname=?, lastname=?, hp=?, gender=?, birth=?, image=? where id_user=?`,
// 							[username, firstname, lastname, hp, gender, birth, image, id],
// 							function(error, rows, field){
// 								if(error){
// 									throw error;
// 								}else{
// 									connection.query(
// 										`SELECT *  FROM user WHERE id_user=${id} LIMIT 1`,
// 										function(error, rows, field){
// 											if(error){
// 												console.log(error);
// 											}else{
// 												return res.send({
// 													data 	: rows,
// 													message : 'Data has been updated'
// 												})

// 											}
// 										}
// 									)
// 								}
// 							}
// 						)
// 					}
// 				}else{
// 					res.status(400).send ({ message : 'Id not valid.' })
// 				}
// 			}
// 		}
// 	)
// }


