//SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';
// const FIELDS = [
// 	{ label: 'Survey Title', name: 'title' },
// 	{ label: 'Subject Line', name: 'subject' },
// 	{ label: 'Email Body', name: 'body' },
// 	{ label: 'Recipient List', name: 'emails' },
// ];
class SurveyForm extends React.Component {
	renderFields() {
		//deconstructe each field of FIELDS
		return _.map(formFields, ({ label, name }) => {
			return <Field key={name} component={SurveyField} type="text" label={label} name={name} />;
		});
		/* <div>
				<Field label="Survey Title" type="text" name="title" component={SurveyField} />
				<Field label="Subject Line" type="text" name="subject" component={SurveyField} />
				<Field label="Email Body" type="text" name="body" component={SurveyField} />
				<Field label="Recipient List" type="text" name="emails" component={SurveyField} /> 
			</div>*/
	}
	render() {
		return (
			<div>
				{/* <form onSubmit={this.props.handleSubmit(() => this.props.onSurveySubmit())}> */}
				<form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
					{this.renderFields()}
					{/* //cancel button to redirect to dashboard */}
					<Link to="/surveys" className="red btn-flat white-text">
						cancel
					</Link>
					<button type="submit" className="teal btn-flat right white-text">
						Next
						<i className="material-icons right">done</i>
					</button>
				</form>
			</div>
		);
	}
}
//passing an object called values contains all values from teh form
function validate(values) {
	const errors = {};

	errors.recipients = validateEmails(values.recipients || '');
	_.each(formFields, ({ name }) => {
		if (!values[name]) {
			errors[name] = 'You must provide a value';
		}
	});

	return errors;
}
export default reduxForm({
	// validate: validate,
	validate,
	form: 'surveyForm',
	destroyOnUnmount: false,
})(SurveyForm);
