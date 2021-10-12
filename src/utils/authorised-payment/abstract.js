/* eslint-disable class-methods-use-this */

class AuthorisedPaymentAbstract {
	data = {};

	constructor(authorisedPaymentData) {
		this.data = authorisedPaymentData || {};
	}

	getType() {
		return this.data.type;
	}

	getContact() {
		return {};
	}

	getShippingAddress() {
		return {};
	}

	getBillingAddress() {
		return {};
	}

	getPayment() {
		return {};
	}
}

export default AuthorisedPaymentAbstract;
