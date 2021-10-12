import isEmpty from "is-empty";
import { getName } from "country-list";
import _get from "lodash.get";

import Abstract from "./abstract";

class GooglePayAuthorisedPayment extends Abstract {
	billingAddressData() {
		const { result } = this.data;
		const { billingAddress } = _get(
			result,
			"paymentMethodData.info",
			_get(result, "paymentMethodData", {})
		);
		return billingAddress;
	}

	getContact() {
		const { result } = this.data;
		const contact = isEmpty(result.shippingAddress)
			? this.billingAddressData()
			: result.shippingAddress;

		return {
			name: contact.name,
			emailAddress: result.email,
			phoneNumber: contact.phoneNumber
		};
	}

	getAddress = source => ({
		addressLines: [source.address1, source.address2, source.address3].filter(
			address => !isEmpty(address)
		),
		administrativeArea: source.administrativeArea,
		locality: source.locality,
		postalCode: source.postalCode,
		country: getName(source.countryCode),
		countryCode: source.countryCode
	});

	getShippingAddress() {
		const { result } = this.data;
		if (isEmpty(result.shippingAddress)) {
			return {};
		}
		return this.getAddress(result.shippingAddress);
	}

	getBillingAddress() {
		const billingAddress = this.billingAddressData();
		if (isEmpty(billingAddress)) {
			return this.getShippingAddress();
		}
		return this.getAddress(billingAddress);
	}

	getPayment() {
		const { result } = this.data;
		const { cardNetwork, cardDetails } = result.paymentMethodData.info;
		return {
			card: {
				network: cardNetwork,
				number: cardDetails
			}
		};
	}
}

export default GooglePayAuthorisedPayment;
