import { combineReducers } from 'redux';
import authReducer from './authReducer';
//rename reducer as reduxForm for better understanding
import { reducer as reduxForm } from 'redux-form';
import surveysReducer from './surveysReducer';
export default combineReducers({
	auth: authReducer,
	form: reduxForm,
	surveys: surveysReducer,
});
