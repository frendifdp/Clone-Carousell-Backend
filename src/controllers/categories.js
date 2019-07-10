'use strict'

const conn = require('../configs/db');

exports.getCategory = function(req, res){
    let sql = `SELECT * FROM category`;
    conn.query(sql, function(error, rows, field){
        res.json({data: rows})
    })
}