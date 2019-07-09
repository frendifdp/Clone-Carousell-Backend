'use strict'

exports.ok = function(value, res){
	const data ={
		status: 200,
		values: value
	};
	res.json(data);
	res.end();
}