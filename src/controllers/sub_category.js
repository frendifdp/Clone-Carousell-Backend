'use strict'

const conn = require('../configs/db');

exports.getSubCategory = function(req, res){
    let sql = `SELECT sub_category.*, category.category_name FROM sub_category 
    INNER JOIN category ON sub_category.id_category=category.id_category`;
    let id = req.params.id || '';
    if(id !== ''){
        sql = sql + ` WHERE sub_category.id_category=${id}`
    }
    conn.query(sql, function(error, rows, field){
        res.json({data: rows})
    })
}