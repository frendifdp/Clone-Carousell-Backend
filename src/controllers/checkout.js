'use strict'

const response = require('../responses/res');
const connection = require('../configs/db');

function sendNotification(message, playerId){
	const data = {
		app_id: "3baaf2c9-40a4-419b-9c15-903900af33df",
		contents: message,
		include_player_ids: [playerId]
	};

	const headers = {
		"Content-Type": "application/json; charset=utf-8"
	};

	const options = {
		host: "onesignal.com",
		port: 443,
		path: "/api/v1/notifications",
		method: "POST",
		headers: headers
	};

	const https = require('https');
	const req = https.request(options, function (res) {
		res.on('data', function (data) {
			console.log("Response:");
			console.log(JSON.parse(data));
		});
	});

	req.on('error', function (e) {
		console.log("ERROR:");
		console.log(e);
	});

	req.write(JSON.stringify(data));
	req.end();
};


function getTime() {
	const today = new Date();
	const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	const dateTime = date + ' ' + time;
	return dateTime;
}


exports.getCheckout = function (req, res) {

	const id_order = req.query.id_order;

	const query = `SELECT checkout.id_checkout,checkout.id_order, checkout.id_user, user.username, user.firstname, user.lastname, user.email, user.hp, checkout.id_product, checkout.total_product,checkout.total_price, product.product_name, product.price, address.address, payment_method.name_payment_method  FROM checkout
						    INNER JOIN address ON checkout.id_address=address.id_address
						    INNER JOIN user ON checkout.id_user=user.id_user
						    INNER JOIN product ON checkout.id_product=product.id_product
						    INNER JOIN payment_method ON checkout.id_payment_method=payment_method.id_payment_method
						    WHERE id_order=\'${id_order}\'`;
	connection.query(
		query,
		function (error, rows, field) {
			if (error) {
				console.log(error);
			} else {
				if (rows != '') {
					return res.send({
						data: rows,
					})
				} else {
					return res.send({
						message: 'Data not found',
					})
				}

			}

		}

	)
}


exports.createCheckout = function (req, res) {
	// ambil data id_user, id_product, total_product, total_price dari table cart
	// ambil data id_order dari frontend
	const id_order = req.body.id_order;
	const id_user = req.body.id_user;
	const id_product = req.body.id_product;
	const total_product = req.body.total_product;
	const id_address = req.body.id_address;
	const total_price = req.body.total_price;
	const id_payment_method = req.body.id_payment_method;
	const playerId = req.query.playerId

	if (!id_user) {
		res.status(400).send('Id User is required');
	} else if (!id_product) {
		res.status(400).send('Id Product is required');
	} else if (!total_product) {
		res.status(400).send('Total Product is required');
	} else if (!id_address) {
		res.status(400).send('Id address is required');
	} else {
		const id_order = Math.random().toString(36).substring(2, 15);
		const dateTime = getTime();
		connection.query(
			`INSERT INTO checkout set id_order=\'${id_order}\', id_user=${id_user}, id_product=${id_product}, total_product=${total_product}, id_address=${id_address}, total_price=${total_price}, id_payment_method=${id_payment_method}, date_checkout=${dateTime}`,
			function (error, rows, field) {
				
			}
		)
		sendNotification({"en": "Your transaction is processed"}, playerId)
	}
}


exports.deleteCheckout = function (req, res, next) {

	const id_order = req.query.id_order;

	connection.query(
		`Delete from checkout where id_order=\'${id_order}\'`,
		function (error, rows, field) {
			if (error) {
				console.log(error)
			} else {
				if (rows.affectedRows != "") {
					return res.send({
						message: 'Data has been delete',
						data: { id_order }
					})
				} else {
					return res.status(400).send({
						message: "Id not valid.",
					})
				}
			}
		}
	)
}