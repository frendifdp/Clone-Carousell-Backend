require('dotenv/config');
const mysql = require('mysql');

const con = mysql.createConnection({
	host 	: process.env.DB_HOST,
	user	: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
})

con.connect(function(error){
	if(error) throw error;
})
module.exports=con;