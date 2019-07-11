'use strict'

const conn = require('../configs/db');

exports.getCategory = function(req, res){
    let sql = `SELECT * FROM category`;
    let id = req.params.id || '';
    if(id !== ''){
        sql = sql + ` WHERE id_category=${id}`
    }
    conn.query(sql, function(error, rows, field){
        res.json({data: rows})
    })
}