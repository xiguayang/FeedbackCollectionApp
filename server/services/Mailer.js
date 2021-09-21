const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
//need API key of Sendgrid
const keys = require('../config/keys');

//customize helper.Mail
class Mailer extends helper.Mail {
	constructor({ subject, recipients }, content) {
		super();

		this.sgApi = sendgrid(keys.sendGridKey);
		this.from_email = new helper.Email('yangznt@gmail.com');
		this.subject = subject;

		//Step 1: using a helper method to format all recipients' addresses
		this.recipients = this.formatAddresses(recipients);

		//Step 1 for Mailer content
		this.body = new helper.Content('text/html', content);
		//Step 2: helper.Mail has the addContent method
		this.addContent(this.body);

		//Step 2:
		//after formatAddresses, taking the helper.Email(address)
		//the list of formatting objects to the Mailer
		this.addRecipients();

		//a helper method for tracking every recipient of every email
		this.addClickTracking();
	}
	//step1 formating recipients
	formatAddresses(recipients) {
		//pull out the email from recipient using es2015
		return recipients.map(({ email }) => {
			//formating every email
			return new helper.Email(email);
		});
	}

	addClickTracking() {
		//the basic of SendGrid works for tracking the recipients
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);

		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}
	//step2: addindg formatting addresses
	addRecipients() {
		const personalize = new helper.Personalization();
		this.recipients.forEach((recipient) => {
			personalize.addTo(recipient);
		});
		this.addPersonalization(personalize);
	}

	//a function that take the Mailer object communicate with the SendGrid API
	async send() {
		const request = this.sgApi.emptyRequest({
			//passing configuration
			method: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON(),
		});
		//.API is provided by sendgrid sgApi object
		const response = await this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;
