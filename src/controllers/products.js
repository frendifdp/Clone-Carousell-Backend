'use strict'

const conn = require('../configs/db');

//INSERT INTO note SET title=?' BETTER than
//INSERT INTO note SET title='${title}'
//GET

// let sql = `SELECT product.id_product as id, product.product_name as product_name, product.brand as brand, n.time as time, c.category as category, c.id as categoryId
//     FROM note as n INNER JOIN category as c ON n.category=c.id `;
const selectQuery = `SELECT *, sc.name_sub_category FROM product INNER JOIN sub_category as sc ON sc.id_sub_category=product.id_sub_category`

exports.getProducts = function (req, res){
    let search = req.query.search || "";
    let sort = req.query.sort || 0;
    let lim = req.query.limit || 10;
    let off = (req.query.page - 1) * lim || 0;
    let start = req.query.start || 0;
    let end = req.query.end || 999999999999;
    let condition = req.query.condition || 'no';

    //PAGING
    if(off < 0){
        off = 1;
    }
    let pageSql = `LIMIT `+ lim +` OFFSET `+ off;
    let totalData;
    let maxPage;

    //FILTER
    let searchBy = `product_name LIKE '%${search}%' OR brand LIKE '%${search}%'`
    let price = `price BETWEEN ${start} AND ${end}`;
    let cond = `\`condition\`=${condition}`;

    //WHERE QUERY
    let where = ''
    if(condition == 'no'){
        where = `(${searchBy}) AND ${price}`;
    }
    else{
        where = `(${searchBy}) AND ${price} AND ${cond}`;
    }

    //MAX PAGE
    let countSql = `SELECT COUNT(id_product) as total FROM product WHERE ${where}`;
    conn.query(countSql, function(error, row, field){
        totalData = row[0].total;
        maxPage = Math.ceil(Number(totalData) / lim);
    });
    
    //SORTING
    let sortBy = ``;
    if(sort == 1){
        sortBy = `date_created DESC`;
    }
    else if(sort == 2){
        sortBy = `price DESC`
    }
    else if(sort == 3){
        sortBy = `price ASC`;
    }
    else{
        sortBy = `product_name ASC`
    }

    let ssql = selectQuery + ` WHERE ${where} ORDER BY ${sortBy} ${pageSql}`;
    console.log(ssql)
    conn.query(ssql, function(error, rows, field){
        // var data = new Array;
        // data = {"total": totalData, "page": Number(req.query.page) || 1,
        // "totalPage": maxPage, "limit" : Number(lim) };
        //"data_found": rows.length,
        let output = {status: 200, "data": rows, "totalPage": maxPage}
        //rows.push(data);
        //console.log(rows[0].image)
        
        // let img = "[\"as\", \"sc\"]"
        // img = JSON.parse(img)
        // console.log(JSON.stringify(img[0]))
        if(totalData == 0){
            res.send([{status: 204, data:"Product not found"}])
        }
        else if(req.query.page > maxPage){
            res.send([{status: 204, data: "No product left"}])
        }
        else{
            res.json(output);
        }
    })
}
    
exports.getProduct = function (req, res){
    let id = req.params.id;
    let ssql = selectQuery + ` WHERE id_product=${id}`;
    conn.query(ssql, function(error, rows, c){
        try {
            let data = {
                status: 200,
                data: rows
            }
            return res.json(data)
        }
        catch (error) {
            return res.send({
                status: 400,
                message: "Get error",
                data: JSON.stringify(temp)
            })
        }
    })
}

//POST
exports.postProduct = function (req, res) {
    let temp = req.body;
    let body = JSON.stringify(temp)

    //REGEX
    body = body.replace(/":+/gi, '=');
    body = body.replace(/,"+/gi, ', ');
	body = body.replace("{\"", '');
    body = body.replace("}", '');
    
    // {
    //     "product_name": "Baju",
    //     "brand": "No brand",
    //     "`condition`": 1,
    //     "price": 100,
    //     "description": "why",
    //     "date_created": "2019-07-09",
    //     "id_wishlist": 1,
    //     "id_sub_category": 1,
    //     "id_user": 2,
    //     "image": "[\"image1\", \"image2\", \"image3\"]"
    // }

    let sql = `INSERT INTO product SET ${body}`;
    console.log(sql);
    let iferror = {
        status: 400,
        message: "Insert error",
        data: JSON.stringify(temp)
    }
    conn.query(sql, function(error, rows, c){
        try {
            let ssql = selectQuery + ` WHERE id_product=${rows.insertId}`;
            conn.query(ssql, function(error, rows, c){
                try {
                    let data = {
                        status: 200,
                        message: "Product has been added",
                        data: rows
                    }
                    return res.json(data)
                }
                catch (error) {
                    return res.send(iferror)
                }
            })
        }
        catch (error) {
            return res.send(iferror)
        }
    })
}

//PUT
exports.patchProduct = function(req, res){
    let id = req.params.id || "";

    let temp = req.body;
    let body = JSON.stringify(temp)

    //REGEX
    body = body.replace(/":+/gi, '=');
    body = body.replace(/,"+/gi, ', ');
	body = body.replace("{\"", '');
    body = body.replace("}", '');
    
    // {
    //     "product_name": "Baju",
    //     "brand": "No brand",
    //     "`condition`": 1,
    //     "price": 100,
    //     "description": "why",
    //     "date_created": "2019-07-09",
    //     "id_wishlist": 1,
    //     "id_sub_category": 1,
    //     "id_user": 2,
    //     "image": "[\"image1\", \"image2\", \"image3\"]"
    // }

    let sql = `UPDATE product WHERE id_product=${id} SET ${body}`;
    console.log(sql);
    let iferror = {
        status: 400,
        message: "Update error",
        data: JSON.stringify(temp)
    }

    conn.query(sql, function(error, rows, c){
        try {
            let ssql = selectQuery + ` WHERE id_product=${id}`;
            conn.query(ssql, function(error, rows, c){
                try {
                    let data = {
                        status: 200,
                        message: "Product has been updated",
                        data: rows
                    }
                    return res.json(data)
                    
                }
                catch (error) {
                    return res.json(iferror)
                }
            })
        }
        catch (error) {
            return res.send(iferror)
        }
    })
}

//DELETE
exports.delProduct = function(req, res){
    let id = req.params.id || "";
    if(id == ""){
        return res.send({
            status: "400",
            message: "Id required",
        })
    }
    else{
        let sql = `DELETE FROM product WHERE id=${id}`;
        conn.query(sql, function (error, row) {
            try {
                return res.send([{
                    status: 200,
                    message: "note has been deleted",
                }])
            }
            catch (error) {
                return res.send({
                    status: 400,
                    message: "Delete failed",
                })
            }
        })
    }
}
