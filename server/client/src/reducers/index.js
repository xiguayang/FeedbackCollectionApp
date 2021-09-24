import { combineReducers } from 'redux';
import authReducer from './authReducer';
//rename reducer as reduxForm for better understanding
import { reducer as reduxForm } from 'redux-form';
export default combineReducers({
	auth: authReducer,
	form: reduxForm,
});
