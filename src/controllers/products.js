'use strict'

const conn = require('../configs/db');

//GET
const selectQuery = `SELECT product.*, category.category_name, sub_category.name_sub_category, u.username, u.image as image_user FROM product
INNER JOIN sub_category ON sub_category.id_sub_category=product.id_sub_category 
INNER JOIN category ON category.id_category=sub_category.id_category 
INNER JOIN user as u ON u.id_user=product.id_user `

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
        try {
            totalData = row[0].total;
            maxPage = Math.ceil(Number(totalData) / lim);
        }
        catch (error) {
            console.log("error")
        }
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
        sortBy = `id_product DESC`
    }

    let ssql = selectQuery + ` WHERE ${where} ORDER BY ${sortBy} ${pageSql}`;

    conn.query(ssql, function(error, rows, field){
        let output = {status: 200, "data": rows, "totalPage": maxPage}
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
    let id = req.params.id || '';
    let where = ` WHERE product.id_product=${id}`;
    conn.query(
        `SELECT count(*) as total_wishlist FROM wishlist WHERE id_product=${id}`,
        function(error, rows, field){
            if(error){
                console.log(error)
            }
            else{
                let ssql = selectQuery + where;
                conn.query(ssql, function(error, rowss, c){
                    try {
                        let data = {
                            status: 200,
                            data: rowss,
                            total_wishlist: rows[0].total_wishlist
                        }
                        return res.json(data)
                    }
                    catch (error) {
                        return res.send({
                            status: 400,
                            message: "Get error"
                        })
                    }
                })
            }
        }
    )
}

exports.getBySub = function (req, res){
    let id = req.params.id || '';
    let where = ` WHERE product.id_sub_category=${id}`;
    let ssql = selectQuery + where;
    conn.query(ssql, function(error, rows, c){
        try {
            const data = {
                status: 200,
                data: rows,
            }
            return res.json(data)
        }
        catch (error) {
            return res.send({
                status: 400,
                message: "Get error",
            })
        }
    })
}

exports.getByUser = function (req, res){
    let id = req.params.id || '';
    let where = ` WHERE product.id_user=${id}`;
    let ssql = selectQuery + where;
    conn.query(ssql, function(error, rows, c){
        try {
            const data = {
                status: 200,
                data: rows,
            }
            return res.json(data)
        }
        catch (error) {
            return res.send({
                status: 400,
                message: "Get error",
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

    let sql = `INSERT INTO product SET ${body}`;
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
    

    let sql = `UPDATE product SET ${body} WHERE id_product=${id}`;
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
                return res.send({
                    status: 200,
                    id: id,
                    message: "Product has been deleted",
                })
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
