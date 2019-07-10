'use strict'

const conn = require('../configs/db');

exports.getSubCategory = function(req, res){
    let sql = `SELECT sub.category.*, category FROM sub_category`;
    conn.query(sql, function(error, rows, field){
        res.json({data: rows})
    })
}