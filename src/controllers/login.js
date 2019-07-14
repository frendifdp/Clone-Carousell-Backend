'use strict'
require('dotenv/config');

const connection = require('../configs/db');
const crypto  	 = require('crypto');
const algorithm  = process.env.ENC_ALGORITHM;
const password 	 = process.env.ENC_PASS;
const jwt        = require('jsonwebtoken');


function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.login = function(req, res){
    const username 		= req.body.username || '';
    const password      = req.body.password || '0';
    let encrypted = encrypt(password)
	const query 		=  `SELECT * FROM user WHERE username='${username}' AND password='${encrypted}'`;
	connection.query(
		query,
		function(error, rows, field){
			if(error){
				return res.send({
                    status: 403,
                    message : 'forbidden',
                })
            }
            else{
				if(rows!=''){
                    jwt.sign({rows}, rows[0].id_user, (err, token) => {
                        return res.send({
                            status: 200,
                            data : rows,
                            token : token
                        })
                    });
                }
                else{
					return res.send({
                        status: 403,
						message:'Incorrect username or password',
					})
				}
			}
		}
	)
}