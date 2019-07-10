require('dotenv/config');
const express 	  = require('express');
const bodyParser  = require('body-parser');
const port 		    = process.env.PORT || 5000;
const app		      = express();

// routes
<<<<<<< HEAD
// const productsRoute   = require('./src/routes/products');
const usersRoute 	    = require('./src/routes/users');
=======
const productsRoute       = require('./src/routes/products');
//const usersRoute 	    = require('./src/routes/products');
>>>>>>> origin/frendi

app.listen(port);
console.log('Server Runing '+port);

app.use( bodyParser.urlencoded({ extended:false }) );
app.use(bodyParser.json());

// app.use('/products', productsRoute);
app.use('/users', usersRoute);

<<<<<<< HEAD
// usersRoute(app);
=======
app.use('/products', productsRoute)
>>>>>>> origin/frendi
