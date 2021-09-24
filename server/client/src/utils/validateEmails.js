const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export default (emails) => {
	//convert a string of emails to array to trim and filter all invalid emails
	const invalidEmails = emails
		.split(',')
		.map((email) => email.trim())
		.filter((email) => re.test(email) === false);

	if (invalidEmails.length) {
		return `These emails are invalid: ${invalidEmails}`;
	}
	return;
};
