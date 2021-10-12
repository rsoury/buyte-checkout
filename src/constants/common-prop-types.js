/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import PropTypes from "prop-types";
import * as itemTypes from "./valid-item-types";

export const CheckoutProps = PropTypes.shape({
	id: PropTypes.string,
	object: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			image: PropTypes.string.isRequired,
			additionalData: PropTypes.object
		})
	),
	gatewayProvider: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		publicKey: PropTypes.string.isRequired
	}),
	currency: PropTypes.string,
	country: PropTypes.string,
	merchant: PropTypes.shape({
		storeName: PropTypes.string,
		website: PropTypes.string,
		logo: PropTypes.string,
		coverImage: PropTypes.string
	})
});

export const ShippingMethodProps = PropTypes.shape({
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	rate: PropTypes.number.isRequired,
	minOrder: PropTypes.number.isRequired,
	maxOrder: PropTypes.number
});

export const ShippingMethodsProps = PropTypes.arrayOf(ShippingMethodProps);

export const ItemProps = PropTypes.shape({
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	amount: PropTypes.number.isRequired,
	formatted: PropTypes.string.isRequired,
	quantity: PropTypes.number.isRequired,
	type: PropTypes.oneOf(Object.entries(itemTypes).map(([_, value]) => value))
});
export const ItemsProps = PropTypes.arrayOf(ItemProps);

export const SettingsProps = PropTypes.shape({
	publicKey: PropTypes.string.isRequired,
	widgetId: PropTypes.string.isRequired,
	options: PropTypes.shape({
		dark: PropTypes.bool,
		enabled: PropTypes.bool
	}),
	items: PropTypes.arrayOf(PropTypes.object)
});

export const AuthorisedPaymentDataProps = PropTypes.shape({
	type: PropTypes.string,
	result: PropTypes.object,
	checkoutId: PropTypes.string,
	paymentMethodId: PropTypes.string,
	shippingMethod: PropTypes.object,
	currency: PropTypes.string,
	country: PropTypes.string,
	amount: PropTypes.number,
	rawPaymentRequest: PropTypes.object
});

export const AddressProps = PropTypes.shape({
	addressLines: PropTypes.arrayOf(PropTypes.string),
	locality: PropTypes.string,
	administrativeArea: PropTypes.string,
	postalCode: PropTypes.string,
	countryCode: PropTypes.string
});

export const PaymentTokenProps = PropTypes.shape({
	id: PropTypes.string,
	object: PropTypes.string,
	amount: PropTypes.number,
	currency: PropTypes.string
});
