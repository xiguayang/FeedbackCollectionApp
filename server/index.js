//import express library
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);
// const authRoutes = require('./routes/authRoutes');
//create a express application
const app = express();

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

//tell NodeJS to listen to this port
//using environment variable defined by Heroku
const PORT = process.env.PORT || 5000;
app.listen(PORT);
