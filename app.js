require('dotenv/config');
const express 	  = require('express');
const bodyParser  = require('body-parser');
const port 		    = process.env.PORT || 5000;
const app		      = express();

// routes
const productsRoute       = require('./src/routes/products');
const usersRoute 	    = require('./src/routes/products');

app.listen(port);
console.log('Server Runing '+port);

app.use( bodyParser.urlencoded({ extended:false }) );
app.use(bodyParser.json());

app.use('/users', usersRoute);
app.use('/products', productsRoute)
