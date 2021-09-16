//import express library
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
// const bodyParser = require('body-parser');
const passport = require('passport');

const keys = require('./config/keys');

require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);
// const authRoutes = require('./routes/authRoutes');
//create a express application
const app = express();
app.use(express.json());
app.use(
	cookieSession({
		//set the maximum time the cookie expires automatically
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
	})
);
app.use(passport.initialize());
app.use(passport.session());

//authRoutes(app)
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
	//Express will serve production assets
	//like our mian.js file, or main.css file
	app.use(express.static('client/build'));
	//Express will serve up the index.html file
	//if it doesent't recognize the route
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}
//tell NodeJS to listen to this port
//using environment variable defined by Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT);
