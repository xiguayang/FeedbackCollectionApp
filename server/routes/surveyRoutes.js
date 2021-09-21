const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emialTemplates/surveyTemplates');

//the model class: pull out the model of mongoose
const Survey = mongoose.model('surveys');

//make sure the user is logged in using middleware
//make sure the user has enough credits to make survey
module.exports = (app) => {
	app.get('/api/surveys/thanks', (req, res) => {
		res.send('Thanks for voting!');
	});
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		//get the values from request.body, deconstruct it
		const { title, subject, body, recipients } = req.body;
		//create a new Survey instance
		const survey = new Survey({
			title: title,
			subject,
			body, //using es25 syntax
			// recipients: recipients.split(',').map((email) => {
			// 	return { email: email.trim() };
			// }),
			recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
			_user: req.user.id,
			dataSent: Date.now(),
		});

		//Greate place to send an email
		const mailer = new Mailer(survey, surveyTemplate(survey));
		try {
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();

			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});
};
