import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions/';
class Payment extends React.Component {
	render() {
		// debugger;
		return (
			<StripeCheckout
				name="Emaily"
				description="$5 for 5 email credits"
				// currency default US dollars
				//500cents
				amount={500}
				//a callback function
				token={(token) => this.props.handleToken(token)}
				stripeKey={process.env.REACT_APP_STRIPE_KEY}
			>
				<button className="btn">Add Credits</button>
			</StripeCheckout>
		);
	}
}
export default connect(null, actions)(Payment);
//test mode credit card number 4242424242424242
