/*
	This module was made to make it simpler for key data extraction.
	ie. getContact, getShippingAddress, getPayment, etc.
	Each payment button has their own file and extends an abstract class that creates defualt outputs.
*/

import * as buttonTypes from "@/constants/button-types";

import GooglePayAuthorisedPayment from "./google-pay";
import ApplePayAuthorisedPayment from "./apple-pay";
import Abstract from "./abstract";

const AuthorisedPayment = authorisedPaymentData => {
	const { type = "" } = authorisedPaymentData || {};
	switch (type) {
		case buttonTypes.GOOGLE_PAY: {
			return new GooglePayAuthorisedPayment(authorisedPaymentData);
		}
		case buttonTypes.APPLE_PAY: {
			return new ApplePayAuthorisedPayment(authorisedPaymentData);
		}
		default: {
			return new Abstract(authorisedPaymentData);
		}
	}
};

export default AuthorisedPayment;
