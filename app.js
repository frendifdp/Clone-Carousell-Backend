require('dotenv/config');
const express 		= require('express');
const bodyParser  	= require('body-parser');
const port 		    = process.env.PORT || 5000;
const app		    = express();
const jwt 			= require('jsonwebtoken');
const cloudinaryConfig = require('./src/configs/cloudinary');


const usersRoute 	  	= require('./src/routes/users');
const loginRoute 	    = require('./src/routes/login');
const forgetPassRoute 	= require('./src/routes/forget_password');
const categoryRoute 	= require('./src/routes/categories');
const subCategoryRoute 	= require('./src/routes/sub_category');
const productsRoute   	= require('./src/routes/products');
const wishlistRoute 	= require('./src/routes/wishlist');
const cartRoute 	    = require('./src/routes/cart');
const checkoutRoute 	= require('./src/routes/checkout');
const uploadRoute 		= require('./src/routes/upload_image');


app.listen(port);
console.log('Server Runing '+port);

app.use( bodyParser.urlencoded({ extended:false }) );
app.use(bodyParser.json());

app.use('*', cloudinaryConfig);
app.use('/upload', uploadRoute)
app.use('/login', loginRoute);
app.use('/send_mail', forgetPassRoute);
app.use('/users', usersRoute);
app.use('/products', productsRoute)
app.use('/categories', categoryRoute);
app.use('/sub_category', subCategoryRoute);
app.use('/wishlist', wishlistRoute);
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