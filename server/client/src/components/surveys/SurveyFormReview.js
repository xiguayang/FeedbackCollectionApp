//SurveyFormReview shows users their form inputs for review
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';
import * as actions from '../../actions';
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
	// const reviewFields = _.map(formFields, (field) => {
	const reviewFields = _.map(formFields, ({ name, label }) => {
		return (
			<div key={name}>
				<label>{label}</label>
				<div>{formValues[name]}</div>
			</div>
		);
	});
	return (
		<div>
			<h5>Please confirm your entries</h5>

			{reviewFields}
			<button className="yellow darken-3 white-text btn-flat" onClick={onCancel}>
				Back
			</button>
			<button onClick={() => submitSurvey(formValues, history)} className="green white-text btn-flat right">
				Send Survey
				<i className="material-icons right">email</i>
			</button>
		</div>
	);
};
//take  redux state and transforming them into some props to
//send down to the component
//auth; form：surveyForm： values
function mapStateToProps(state) {
	//console.log(state)
	return { formValues: state.form.surveyForm.values };
}
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
