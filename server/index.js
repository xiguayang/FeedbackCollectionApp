//import express library
const express = require('express');
//create a express application
const app = express();

//create a route handler associated with app
app.get('/', (req, res) => {
	res.send({ hi: 'there' });
});
//tell NodeJS to listen to this port
//using environment variable defined by Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//localhost:5000
