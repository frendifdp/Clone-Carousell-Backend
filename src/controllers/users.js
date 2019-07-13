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

function getTime(){
	const today = new Date();
	const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	const dateTime = date+' '+time;
	return dateTime;
}


exports.getUsers = function(req, res){

	const username 		= req.query.username;

	const query 		=  `SELECT *  FROM user WHERE username=\'${username}\' LIMIT 1`;
		connection.query(
			query,
			function(error, rows, field){
				if(error){
					console.log(error);
				}else{
					if(rows!=''){
						return res.send({
							data  		: rows[0],
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

	const user 		= req.body.username;
	const password 	= encrypt(req.body.password);
	const email		= req.body.email;

	if(!user){
		res.status(400).send('username is require');
	}else if(!password){
		res.status(400).send('Password is require');
	}else if(!email){
		res.status(400).send('Email is require');
	}else{ 
	//cek username, email ada yang sama gak
		connection.query(
			`SELECT * from user where username=\'${user}\' LIMIT 1`,
			function(error, rows, field){
				if(error){
					console.log(error)
				}else{

					if(rows!=''){
						return res.send({
							message: 'Username is exist'
						})
					}else{
						connection.query(
							`SELECT * from user where email=\'${email}\' LIMIT 1`,
							function(error, rowss, field){
								if(error){
									console.log(error)
								}else{
									if(rowss!=''){
										return res.send({
											message: 'Email has been registered'
										})
									}else{
										const date = getTime();
										connection.query( //insert
											`Insert into user set username=?, password=?, email=?, date_create=?`,
											[user, password, email, date],
											function(error, rowsss, field){
												if(error){
													console.log(error);
												}else{
													connection.query(
														`SELECT *  FROM user ORDER BY id_user DESC LIMIT 1`, function(error, rowssss, field){
															if(error){
																console.log(error);
															}else{
																return res.send({
																	data 	: rowssss,
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
							}
						)
					}
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
				console.log(error);
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
									console.log(error);
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