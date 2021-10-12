import AuthorisedPayment from "../authorised-payment";
import * as buttonTypes from "@/constants/button-types";

const googlePayAuthorisedPaymentData = {
	type: "GOOGLE_PAY",
	result: {
		apiVersionMinor: 0,
		apiVersion: 2,
		paymentMethodData: {
			description: "Mastercard •••• 6127",
			tokenizationData: {
				type: "PAYMENT_GATEWAY",
				token:
					'{\n  "id": "tok_1F3J9LITpNO3y6f_TEST!!!_Ly",\n  "object": "token",\n  "card": {\n    "id": "card_1F3J9LITpN_TEST!!!_ql",\n    "object": "card",\n    "address_city": null,\n    "address_country": null,\n    "address_line1": null,\n    "address_line1_check": null,\n    "address_line2": null,\n    "address_state": null,\n    "address_zip": null,\n    "address_zip_check": null,\n    "brand": "MasterCard",\n    "country": "US",\n    "cvc_check": null,\n    "dynamic_last4": "4242",\n    "exp_month": 10,\n    "exp_year": 2021,\n    "funding": "credit",\n    "last4": "6127",\n    "metadata": {\n    },\n    "name": "John Doe",\n    "tokenization_method": "android_pay"\n  },\n  "client_ip": "99.999.999.99",\n  "created": 1564823019,\n  "livemode": false,\n  "type": "card",\n  "used": false\n}\n'
			},
			type: "CARD",
			info: {
				cardNetwork: "MASTERCARD",
				cardDetails: "6127"
			}
		},
		shippingAddress: {
			phoneNumber: "+61 400 400 400",
			address3: "",
			sortingCode: "",
			address2: "Sydney",
			countryCode: "AU",
			address1: "50 Bridge St",
			postalCode: "2000",
			name: "John Doe",
			locality: "Sydney",
			administrativeArea: "NSW"
		},
		email: "example@buyte.dev"
	},
	checkoutId: "203ef02b-607f-4ba3-a7de-e6a8409d2005",
	paymentMethodId: "aa6e0cf8-ffe8-47a6-988f-309cbee53e9a",
	currency: "AUD",
	country: "AU",
	amount: 1200,
	rawPaymentRequest: {}
};

const applePayAuthorisedPaymentData = {
	type: "APPLE_PAY",
	result: {
		billingContact: {},
		shippingContact: {
			addressLines: ["50 Bridge St"],
			administrativeArea: "NSW",
			country: "Australia",
			countryCode: "AU",
			emailAddress: "example@buyte.dev",
			familyName: "Doe",
			givenName: "John",
			locality: "Lalor Park",
			phoneNumber: "04400400400",
			postalCode: "2000"
		},
		token: {
			paymentData: {
				data:
					"OhYDZzTOmn55sDpW6m2iRKOAXjZX6gtpka+pTw+8P/cvI3KQ1GfqY3WYKrtK+wpf1P6WOJrN6FlJc9G2Ip0Fqd5ob4m84ML1PGyeLLzKoePvWYBaZjHRo4F5Q9qjnpvc1Re9uzfRxUd75Rw4wHI9tHSE4cDpTF0JWueE9zPROtMGae2Vayrn2zsmi6lOKGRxE5LP45Zj0ugG9/8tchaLERB5oibpuhrOa5rjcgXpa3ElV7XfGE3ZaZmEFrYnbdbMSSIf95CgH+JZUXgmCZRYrXUzR4AfAJmSiWmTD0YMQYM2/tKPBgygWaSVBRNHO6gHNR3xWJn2pvSBbveZeZ5ZDF6KO4vdfKKaQNjTpJlyL4d+jlT8KDSzJ8dy0OjHNNrm3LcuXU9FA8zUnEzz",
				header: {
					ephemeralPublicKey:
						"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEE7q2cQhoD8COhBUdk0Ys8O9annGU2l+tKHIC5lzSPlj1ZDPSvWU7CxWm1Kq9AboEAPItMwjG+N+g3YXE7eSSzQ==",
					publicKeyHash: "m3IG4PqOCg9+WaKkCv/y5us8QwZ5SmNDpPq1w8t3428=",
					transactionId:
						"157a859deb57bc592ac4617b99aa8fb38a0958aff2a55d4bc4a49ec8ee6f664b"
				},
				signature:
					"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",
				version: "EC_v1"
			},
			paymentMethod: {
				displayName: "JCB 6127",
				network: "Visa",
				type: "debit"
			},
			transactionIdentifier:
				"157A859DEB57BC592AC4617B99AA8FB38A0958AFF2A55D4BC4A49EC8EE6F664B"
		}
	},
	checkoutId: "203ef02b-607f-4ba3-a7de-e6a8409d2005",
	paymentMethodId: "aa6e0cf8-ffe8-47a6-988f-309cbee53e9a",
	currency: "AUD",
	country: "AU",
	amount: 1200,
	rawPaymentRequest: {}
};

const googlePayAuthorisedPayment = new AuthorisedPayment({
	type: buttonTypes.GOOGLE_PAY,
	...googlePayAuthorisedPaymentData
});
const applePayAuthorisedPayment = new AuthorisedPayment({
	type: buttonTypes.APPLE_PAY,
	...applePayAuthorisedPaymentData
});

export default {
	[buttonTypes.GOOGLE_PAY]: {
		shippingContact: googlePayAuthorisedPayment.getContact(),
		authorisedPaymentData: googlePayAuthorisedPaymentData
	},
	[buttonTypes.APPLE_PAY]: {
		shippingContact: applePayAuthorisedPayment.getContact(),
		authorisedPaymentData: applePayAuthorisedPaymentData
	}
};
