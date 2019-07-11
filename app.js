require('dotenv/config');
const express 	  = require('express');
const bodyParser  = require('body-parser');
const port 		    = process.env.PORT || 5000;
const app		      = express();
const jwt = require('jsonwebtoken');

const multer = require('multer');
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
const Datauri = require('datauri');
const path = require('path');
const dUri = new Datauri;
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
const cloudinaryConfig = require('./src/configs/cloudinary');
const cloudinary = require('cloudinary');

const usersRoute 	  = require('./src/routes/users');
const productsRoute   = require('./src/routes/products');
const cartRoute 	    = require('./src/routes/cart');
const loginRoute 	    = require('./src/routes/login');
const checkoutRoute 	    = require('./src/routes/checkout');
const categoryRoute 	    = require('./src/routes/categories');
const subCategoryRoute 	    = require('./src/routes/sub_category');
const forgetPassRoute 	    = require('./src/routes/forget_password');


app.listen(port);
console.log('Server Runing '+port);

app.use( bodyParser.urlencoded({ extended:false }) );
app.use(bodyParser.json());

app.use('*', cloudinaryConfig);
app.post('/upload', multerUploads, (req, res) => {
	if(req.file) {
		const file = dataUri(req).content;
		return cloudinary.uploader.upload(file).then((result) => {
			const image = result.url;
			return res.status(200).json({
				messge: 'Your image has been uploded successfully to cloudinary',
				data: {image}
			})
		}).catch((err) => res.status(400).json({
			message: 'someting went wrong while processing your request',
			data: {err}
		}))
	}
});

app.use('/login', loginRoute);
app.use('/products', productsRoute)
app.use('/users', usersRoute);
app.use('/cart', cartRoute);
app.use('/checkout', checkoutRoute);


app.use('/categories', categoryRoute);
app.use('/sub_category', subCategoryRoute);
app.use('/send_mail', forgetPassRoute);

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