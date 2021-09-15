const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
module.exports = (app) => {
	app.post('/api/stripe', requireLogin, async (req, res) => {
		// create a charge object
		const charge = await stripe.charges.create({
			amount: 500,
			currency: 'usd',
			description: '$5 for 5 email credits',
			source: req.body.id,
		});
		// console.log(charge);
		//we can access current user because of passport.js has set it to req
		req.user.credits += 5;
		const user = await req.user.save();
		res.send(user);
	});
};
