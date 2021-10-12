import isEmpty from "is-empty";
import request from "@/utils/request";

export default function(publicKey) {
	return {
		getFullCheckout(widgetId, options = {}) {
			return request
				.get(`/public/checkout/${widgetId}/`, {
					params: Object.assign(
						{},
						!isEmpty(options.user_country_code)
							? {
									user_country_code: options.user_country_code
							  }
							: {}
					),
					headers: {
						Authorization: `Bearer ${publicKey}`
					}
				})
				.then(({ data }) => data);
		},
		getApplePaySession(url) {
			return request
				.post(
					`/public/applepay/session/`,
					{
						url
					},
					{
						headers: {
							Authorization: `Bearer ${publicKey}`
						}
					}
				)
				.then(({ data }) => data);
			// Maybe trigger toast on error here...
		},
		processApplePayPayment(payment = {}) {
			return request
				.post(
					`/public/applepay/process/`,
					{
						...payment
					},
					{
						headers: {
							Authorization: `Bearer ${publicKey}`
						}
					}
				)
				.then(({ data }) => data);
		},
		processGooglePayPayment(payment = {}) {
			return request
				.post(
					`/public/googlepay/process/`,
					{
						...payment
					},
					{
						headers: {
							Authorization: `Bearer ${publicKey}`
						}
					}
				)
				.then(({ data }) => data);
		}
	};
}
