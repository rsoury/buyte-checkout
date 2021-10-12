export default {
	settings: {
		items: [
			{
				name: "This is my cool product!",
				amount: 400,
				quantity: 5
			}
		],
		options: {},
		publicKey: "pk_YICkLIG2LPQfZvM3YE00LSDtXIQ5KvYfAPGiYSKkYPNyAPM2Xw9l",
		widgetId: "a1aeb05b-3f02-4dd5-b9a9-941377fb9c15"
	},
	checkout: {
		id: "a1aeb05b-3f02-4dd5-b9a9-941377fb9c15",
		object: "full_checkout",
		options: [
			{
				id: "5126415b-71ec-40d6-94a7-5d3bc6e3f37f",
				name: "Google Pay",
				image:
					"https://s3-ap-southeast-2.amazonaws.com/buyte.au/assets/mobile-web-payments/google-pay.png",
				additionalData: {
					merchantId: "",
					merchantName: "Buyte Google Pay Checkout"
				}
			},
			{
				id: "11cfbaf1-8094-498d-af51-c38d7cf4bc0d",
				name: "Apple Pay",
				image:
					"https://s3-ap-southeast-2.amazonaws.com/buyte.au/assets/mobile-web-payments/apple-pay.png"
			}
		],
		shippingMethods: [
			{
				id: "18c13641-c8a4-4e5d-a237-c6a7803477b3",
				name: "Free Shipping",
				description: "",
				rate: 0,
				minOrder: 5000
			},
			{
				id: "37dd7d85-ecb5-476b-84f7-dcf65e3a463b",
				name: "Standard Shipping",
				description: "",
				rate: 990,
				minOrder: 0,
				maxOrder: 5000
			}
		],
		gatewayProvider: {
			id: "723ba8ea-06d2-452c-b899-54091a7ad3d2",
			name: "Stripe",
			publicKey: ""
		},
		currency: "AUD",
		country: "AU",
		merchant: {
			storeName: "Test Store Name",
			website: "teststorename.com"
		}
	},
	items: [
		{
			id: "ad8db2d2-1ef3-331d-969d-5e0293dcd72d",
			name: "This is my cool product!",
			amount: 400,
			quantity: 5,
			formatted: "20.00",
			type: "product"
		}
	],
	type: "APPLE_PAY",
	paymentRequest: {
		countryCode: "AU",
		currencyCode: "AUD",
		shippingMethods: [
			{
				identifier: "standard_shipping",
				label: "Standard Shipping",
				detail: "",
				amount: "9.90"
			}
		],
		lineItems: [
			{
				label: "5x This is my cool product!",
				amount: "20.00"
			}
		],
		total: {
			label: "Test Store Name Total",
			amount: "20.00"
		},
		supportedNetworks: ["amex", "discover", "masterCard", "visa"],
		merchantCapabilities: ["supports3DS"],
		requiredShippingContactFields: ["email", "name", "postalAddress", "phone"]
	}
};
