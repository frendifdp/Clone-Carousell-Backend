require('dotenv/config');
const express 	  = require('express');
const bodyParser  = require('body-parser');
const port 		    = process.env.PORT || 5000;
const app		      = express();
const jwt = require('jsonwebtoken');

const usersRoute 	  = require('./src/routes/users');
const productsRoute   = require('./src/routes/products');
const cartRoute 	    = require('./src/routes/cart');
const loginRoute 	    = require('./src/routes/login');
const checkoutRoute 	    = require('./src/routes/checkout');


app.listen(port);
console.log('Server Runing '+port);

app.use( bodyParser.urlencoded({ extended:false }) );
app.use(bodyParser.json());

app.use('/login', loginRoute);
app.use('/products', productsRoute)
app.use('/users', usersRoute);
app.use('/cart', cartRoute);
app.use('/checkout', checkoutRoute);



app.use(verifyToken, (req, res, next) => {  
	jwt.verify(req.token, 'secretkey', (err) => {
	  	if(err) {
			res.sendStatus(403);
	  	}
	  	else{
			next()
		}
	});
});

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
  	if(typeof authHeader !== 'undefined') {
    	const authToken = authHeader;
    	req.token = authToken;
    	next();
	}
	else {
    	res.sendStatus(403);
  	}
}

