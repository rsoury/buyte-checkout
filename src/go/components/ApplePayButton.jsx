import React, { Component } from "react";
import _get from "lodash.get";
import { identifyUser, handleException } from "@/utils/tracking";

import PayButton, {
	PayButtonPropTypes,
	PayButtonDefaultProps
} from "./PayButton";
import { ApplePayLogo } from "@/assets";
import { APPLE_PAY } from "@/constants/button-types";
import AuthorisedPayment from "@/utils/authorised-payment";
import { formatAmount } from "@/utils/amount";

const { ApplePaySession } = window;

class ApplePayButton extends Component {
	ApplePaySession = ApplePaySession;

	onClick = () => {
		const {
			actions,
			onPayButtonClick = () => {},
			onPaymentSheetClose = () => {},
			onPaymentSheetOpen = () => {}
		} = this.props;
		const paymentRequest = this.generatePaymentRequest();
		const session = new ApplePaySession(1, paymentRequest);

		/**
		 * Merchant Validation
		 * We call our merchant session endpoint, passing the URL to use
		 */
		session.onvalidatemerchant = event => {
			// Call a fuction that makes a request to the API, to create a session.
			actions
				.getApplePaySession(event.validationURL)
				.then(response => {
					onPaymentSheetOpen();
					session.completeMerchantValidation(response);
				})
				.catch(e => {
					handleException(
						e,
						{ event },
						"Could not validate merchant for Apple Pay session"
					);
				});
		};

		/**
		 * Payment Authorization
		 * Here you receive the encrypted payment data. You would then send it
		 * on to your payment provider for processing, and return an appropriate
		 * status in session.completePayment()
		 */
		session.onpaymentauthorized = event => {
			// Identify user -- using email for id for now.
			const userId = _get(event, "shippingContact.emailAddress");
			if (userId) {
				identifyUser(userId, {
					pay: "apple",
					name: [
						_get(event, "shippingContact.givenName"),
						_get(event, "shippingContact.familyName")
					]
						.filter(name => !!name)
						.join(" ")
				});
			}

			// Send payment for processing...
			const {
				checkout,
				paymentOptionName,
				totalAmount,
				onAuthorisedPayment,
				isShippingEnabled
			} = this.props;
			const authorisedPaymentData = {
				type: APPLE_PAY,
				result: event.payment,
				checkoutId: checkout.id,
				paymentMethodId: (
					checkout.options.find(({ name }) => name === paymentOptionName) || {}
				).id,
				currency: checkout.currency,
				country: checkout.country,
				amount: totalAmount,
				rawPaymentRequest: paymentRequest
			};
			let shippingContact = {};
			if (isShippingEnabled) {
				const ap = AuthorisedPayment(authorisedPaymentData);
				shippingContact = {
					...ap.getContact(),
					...ap.getShippingAddress()
				};
			}
			session.completePayment(ApplePaySession.STATUS_SUCCESS);
			setTimeout(() => {
				onAuthorisedPayment({ shippingContact, authorisedPaymentData });
			}, 1000);
		};

		session.onclose = () => {
			onPaymentSheetClose();
		};

		// All our handlers are setup - start the Apple Pay payment
		try {
			session.begin();
		} catch (e) {
			handleException(e, "Cannot begin Apple Pay session");
		}

		onPayButtonClick();
	};

	generateProductItems() {
		const { items } = this.props;
		return items.map(({ name, formatted, quantity = 1 }) => ({
			label: quantity > 1 ? `${quantity}x ${name}` : name,
			amount: formatted
		}));
	}

	generatePaymentRequest() {
		const { checkout = {}, isShippingEnabled, totalAmount } = this.props;
		const { country, currency, merchant } = checkout;

		const totalAmountFloat = formatAmount(totalAmount);

		const lineItems = this.generateProductItems();
		if (isShippingEnabled) {
			lineItems.push({
				label: "Shipping",
				amount: "0.00",
				type: "pending"
			});
		}

		let paymentRequest = {
			countryCode: country || "AU",
			currencyCode: currency || "AUD",
			lineItems,
			total: {
				label: merchant.storeName,
				amount: totalAmountFloat
			},

			supportedNetworks: ["amex", "discover", "masterCard", "visa"],
			merchantCapabilities: ["supports3DS"]
		};

		if (isShippingEnabled) {
			paymentRequest = {
				...paymentRequest,
				requiredShippingContactFields: [
					"email",
					"name",
					"postalAddress",
					"phone"
				]
			};
		} else {
			paymentRequest = {
				...paymentRequest,
				requiredShippingContactFields: ["email", "name", "phone"],
				requiredBillingContactFields: ["postalAddress"]
			};
		}

		return paymentRequest;
	}

	isValid() {
		if (this.ApplePaySession) {
			if (ApplePaySession.canMakePayments) {
				return true;
			}
		}
		return false;
	}

	render() {
		const { buttonProps = {}, onPayButtonHover = () => {} } = this.props;
		return this.isValid() ? (
			<PayButton
				onClick={this.onClick}
				onHover={onPayButtonHover}
				{...buttonProps}
			>
				<ApplePayLogo alt="Buyte: Apple Pay" width={65} height={30} />
			</PayButton>
		) : null;
	}
}

ApplePayButton.propTypes = PayButtonPropTypes;

ApplePayButton.defaultProps = PayButtonDefaultProps;

export default ApplePayButton;
