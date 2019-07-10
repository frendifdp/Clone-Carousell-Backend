'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');

const crypto	= require('crypto');
const algorithm = 'aes-256-ctr';
const password 	= 'd6F3Efeq';



function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.getUsers = function(req, res){

	const username 		= req.query.username || '';

	const query 		=  `SELECT *  FROM user WHERE username Like '%${username}%' LIMIT 10`;
		connection.query(
			query,
			function(error, rows, field){
				if(error){
					console.log(error);
				}else{
					if(rows!=''){
						return res.send({
							data  		: rows,
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



exports.createUsers = function(req, res){

	const username 	= req.body.username;
	const password 	= encrypt(req.body.password);
	const email		= req.body.email;

	if(!username){
		res.status(400).send('username is require');
	}else if(!password){
		res.status(400).send('Password is require');
	}else if(!email){
		res.status(400).send('Email is require');
	}else{
		connection.query(
			`Insert into user set username=?, password=?, email=?`,
			[username, password, email],
			function(error, rows, field){
				if(error){
					throw error;
				}else{
					connection.query(
						`SELECT *  FROM user ORDER BY id_user DESC LIMIT 1`, function(error, rows, field){
							if(error){
								console.log(error);
							}else{
								return res.send({
									data 	: rows,
									message : "Data has been saved"
								})
							}
						}
					)
				}
			}
		)
	}
}


exports.updateUsers = function(req, res, next){

	const id 			= req.params.id_user;
	const username 		= req.body.username;
	const firstname 	= req.body.firstname || null;
	const lastname		= req.body.lastname || null;
	const hp			= req.body.hp || null;
	const gender		= req.body.gender || null;
	const birth			= req.body.birth || null;
	const image			= req.body.image || null;

	connection.query(
		`select * from user where id_user=?`,[id],
		function(error, rows, field){
			if(error){
				throw error;
			}else{
				if(rows != ""){
					if(!username){
						res.status(400).send ({ message : 'Username is require' });
					}else{
						console.log(birth)
						connection.query(
							`Update user set username=?, firstname=?, lastname=?, hp=?, gender=?, birth=?, image=? where id_user=?`,
							[username, firstname, lastname, hp, gender, birth, image, id],
							function(error, rows, field){
								if(error){
									throw error;
								}else{
									connection.query(
										`SELECT *  FROM user WHERE id_user=${id} LIMIT 1`,
										function(error, rows, field){
											if(error){
												console.log(error);
											}else{
												return res.send({
													data 	: rows,
													message : 'Data has been updated'
												})

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



// Change Password
exports.changePassword 	= function(req, res, next){

	const id 					= req.params.id_user;
	const password 		= req.body.password;
	const newPassword = req.body.newPassword;
	const oldPassword	= req.body.oldPassword;

	connection.query(
		`select * from user where id_user=?`,[id],
		function(error, rows, field){
			if(error){
				console.log(error);
			}else{
				if(rows!=''){
					if(!password){
						res.status(400).send ({ message : 'Password is require' });
					}else if(!newPassword){
						res.status(400).send ({ message : 'New Password is require' });
					}else if(newPassword !== oldPassword){
						res.status(400).send ({ message : 'New Password not matching' });
					}else{
						const pass = decrypt(rows[0].password);
						if(pass !== password){
							res.status(400).send ({ message : 'Wrong password!' });
						}else{
						const pass = encrypt(newPassword)
							connection.query(
								`Update user set password=? where id_user=?`,
								[pass, id],
								function(error, rows, field){
									if(error){
										console.log(error);
									}else{
										return res.send({
											data 	: rows,
											message : 'Data has been updated'
										})
									}
								}
							)
						}
					}
				}
			}
		}
	)
}

// 