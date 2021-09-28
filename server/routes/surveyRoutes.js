const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplates');

//the model class: pull out the model of mongoose
const Survey = mongoose.model('surveys');

//make sure the user is logged in using middleware
//make sure the user has enough credits to make survey
module.exports = (app) => {
	app.get('/api/surveys', requireLogin, async (req, res) => {
		const surveys = await Survey.find({ _user: req.user.id })
			//query.select('key1 key2') include key1 key2
			//query.select('-key3 -key4') exclude key3 key4
			//query.select({key1: 1, key2:1}) include 1 or true; exclude 0 or false
			.select({ recipients: false });
		res.send(surveys);
	});
	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send('Thanks for voting!');
	});
	app.post('/api/surveys/webhooks', (req, res) => {
		// const events = _.map(req.body, (event) => {
		// 	//for every event object, extract just the path of url
		// 	const pathname = new URL(event.url).pathname;
		// 	//create a matcher we need for the url
		// 	const path = new Path('/api/surveys/:surveyId/:choice');
		// 	//use the matcher path to extract the surveyId and choice from the pathname
		// 	//if there is matches, return the extracted path object or it will be null
		// 	const match = path.test(pathname);
		// 	if (match) {
		// 		return { email: event.email, surveyId: match.surveyId, choice: match.choice };
		// 	}
		// });
		//create a matcher we need for the url
		const path = new Path('/api/surveys/:surveyId/:choice');
		// const events = _.map(req.body, ({ email, url }) => {
		// 	//for every event object, extract just the path of url
		// 	//use the matcher path to extract the surveyId and choice from the pathname
		// 	//if there is matches, return the extracted path object or it will be null
		// 	//cannot deconstruct surveyId and choice, since it may return null
		// 	const match = path.test(new URL(url).pathname);
		// 	if (match) {
		// 		return { email, surveyId: match.surveyId, choice: match.choice };
		// 	}
		// });
		// const compactEvents = _.compact(events);
		// const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
		_.chain(req.body)
			.map(({ email, url }) => {
				//for every event object, extract just the path of url
				//use the matcher path to extract the surveyId and choice from the pathname
				//if there is matches, return the extracted path object or it will be null
				//cannot deconstruct surveyId and choice, since it may return null
				const match = path.test(new URL(url).pathname);
				if (match) {
					return { email, surveyId: match.surveyId, choice: match.choice };
				}
			})
			.compact()
			.uniqBy('email', 'surveyId')
			.each(({ surveyId, email, choice }) => {
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false },
						},
					},
					{
						//second object to describe how the survey to be updated
						//$inc: find the key choice(yes or no) and increment it by one
						$inc: { [choice]: 1 },
						//.$. points to the match recipient founded
						$set: { 'recipients.$.responded': true },
						lastResponded: new Date(),
					}
				).exec();
			})
			.value();
		// console.log(events);
		res.send({});
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
			dateSent: Date.now(),
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
