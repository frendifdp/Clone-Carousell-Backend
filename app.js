require('dotenv/config');
const express 	  = require('express');
const bodyParser  = require('body-parser');
const port 		    = process.env.PORT || 5000;
const app		      = express();

// routes
const productsRoute 	    = require('./src/routes');

app.listen(port, () => {
  console.log(`Server Clone Carousell Runing on port ${port}`);
});

app.use(bodyParser.json());
app.use( bodyParser.urlencoded({ extended:false }) );

app.use('/products', productsRoute)