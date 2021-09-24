import axios from 'axios';
import { FETCH_USER } from './types';

//make a AJAX request to backend Express API
//have already set proxy in setupProxy.js add '/api'

// Original Version:
// export const fetchUser = () => {
// 	return function (dispatch) {
// 		axios.get('/api/current_user').then((res) => dispatch({ type: FETCH_USER, payload: res }));
// 	};
// };

//Refactor step 1: the arrow function only return 1 so remove return
// export const fetchUser = () =>
// 	function (dispatch) {
// 		axios.get('/api/current_user').then((res) => dispatch({ type: FETCH_USER, payload: res }));
// 	};

//Refactor Step 2: using => instead of function keyword
// export const fetchUser = () => (dispatch) => {
// 	axios.get('/api/current_user').then((res) => dispatch({ type: FETCH_USER, payload: res }));
// };

//Refactor Step 3: using async await instead of Promise
export const fetchUser = () => async (dispatch) => {
	const res = await axios.get('/api/current_user');
	dispatch({ type: FETCH_USER, payload: res.data });
};

//sending the token from Stripe CreditCard Payments to our API server
export const handleToken = (token) => async (dispatch) => {
	const res = await axios.post('/api/stripe', token);
	dispatch({ type: FETCH_USER, payload: res.data });
};

//submit surveys to recipients
export const submitSurvey = (formValues, history) => async (dispatch) => {
	const res = await axios.post('/api/surveys', formValues);
	history.push('/surveys');
	//just update the user data with new reduced credits
	dispatch({ type: FETCH_USER, payload: res.data });
};
