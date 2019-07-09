'use strict'

const response 	= require('../responses/res');
const connection= require('../configs/db');


exports.getUsers = function(req, res){

	const title 		= req.query.search || '';
	const sort 			= req.query.sort || 'DESC';
	const page 			= parseInt(req.query.page || 1);
	const limit 		= parseInt(req.query.limit || 10);
	const offset 		= ((page - 1)*limit ) || 0;
	const idCategory	= req.query.category || ''

	const query 		=  `SELECT note.idNote, note.title, note.note, note.time, note.category as idCategory, category.category  FROM note LEFT JOIN category ON note.category=category.id WHERE note.title LIKE '%${title}%'  ORDER BY note.time ${sort} LIMIT ${limit} OFFSET ${offset}`;
	
	connection.query(
		`SELECT count(*) as total from note where title  LIKE '%${title}%' `,function(error, rows){
			if(error){
				throw error;
			}else{

				const total 		= rows[0].total;
				const totalPage 	= Math.ceil(total/limit);
				
				connection.query(
					query,
					function(error, rows, field){
						if(error){
							throw error;
						}else{
							if(rows!=''){
								return res.send({
									data  		: rows,
									total 		: total,
									page  		: page,
									totalPage 	: totalPage,
									limit 		: limit,
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
	)
}