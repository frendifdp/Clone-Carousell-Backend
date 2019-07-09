'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');


exports.getUsers = function(req, res){

	// const username 		= req.query.username;
	const query 		=  `SELECT *  FROM user LIMIT 1`;
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

				