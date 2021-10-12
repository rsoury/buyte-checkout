import isEmpty from "is-empty";
import { getName } from "country-list";
import _get from "lodash.get";

import Abstract from "./abstract";

class ApplePayAuthorisedPayment extends Abstract {
	getContact() {
		const { result } = this.data;
		const {
			givenName,
			familyName,
			emailAddress,
			phoneNumber
		} = result.shippingContact;
		const name = `${givenName} ${familyName}`;
		return {
			name,
			emailAddress,
			phoneNumber
		};
	}

	getAddress = source => ({
		addressLines: source.addressLines,
		administrativeArea: source.administrativeArea,
		locality: source.locality,
		postalCode: source.postalCode,
		country: source.countryCode ? getName(source.countryCode) : "",
		countryCode: source.countryCode
	});

	getShippingAddress() {
		const { result = {} } = this.data;
		if (isEmpty(_get(result, "shippingContact.addressLines"))) {
			return {};
		}
		return this.getAddress(result.shippingContact);
	}

	getBillingAddress() {
		const { result = {} } = this.data;
		if (isEmpty(_get(result, "billingContact.addressLines"))) {
			return this.getShippingAddress();
		}
		return this.getAddress(result.billingContact);
	}

	getPayment() {
		const { result } = this.data;
		const [network, number] = result.token.paymentMethod.displayName.split(" ");
		return {
			card: {
				network,
				number
			}
		};
	}
}

export default ApplePayAuthorisedPayment;
