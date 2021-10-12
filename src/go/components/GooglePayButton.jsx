import React, { Component } from "react";
import Script from "react-load-script";
import _get from "lodash.get";
import { withToastManager } from "react-toast-notifications";

import PayButton, {
	PayButtonPropTypes,
	PayButtonDefaultProps
} from "./PayButton";
import { GooglePayLogo } from "@/assets";
import isProd from "@/utils/is-prod";
import { identifyUser, handleException } from "@/utils/tracking";
import { GOOGLE_PAY } from "@/constants/button-types";
import AuthorisedPayment from "@/utils/authorised-payment";
import { formatAmount } from "@/utils/amount";

class GooglePayButton extends Component {
	state = {
		isReady: false,
		isValid: false,
		isLoading: false
	};

	client = null;

	baseRequest = {
		apiVersion: 2,
		apiVersionMinor: 0
	};

	baseCardPaymentMethod = {
		type: "CARD",
		parameters: {
			allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
			allowedCardNetworks: [
				"AMEX",
				"DISCOVER",
				"INTERAC",
				"JCB",
				"MASTERCARD",
				"VISA"
			]
		}
	};

	validate = async () => {
		const isReadyToPayRequest = Object.assign({}, this.baseRequest, {
			allowedPaymentMethods: [{ ...this.baseCardPaymentMethod }]
		});
		try {
			const response = await this.client.isReadyToPay(isReadyToPayRequest);
			if (response.result) {
				this.setState({ isValid: true });
			}
		} catch (e) {
			handleException(
				e,
				{ isReadyToPayRequest },
				"Could not validate merchant for Google Pay session"
			);
		}
		return true;
	};

	onClick = () => {
		const {
			onPayButtonClick,
			onPaymentFailure,
			onPaymentSheetClose
		} = this.props;
		const paymentRequest = this.generatePaymentRequest();

		// Initiate payment
		this.client
			.loadPaymentData(paymentRequest)
			.then(paymentData => {
				// Identify user -- using email for id for now.
				const userId = _get(paymentData, "email");
				if (userId) {
					identifyUser(userId, {
						pay: "google",
						name: _get(paymentData, "shippingAddress.name")
					});
				}

				// Send payment for processing...
				this.setState({ isLoading: true });

				// Send back authorisedPaymentData and ShippingContact if shipping is set.
				const { checkout, totalAmount, isShippingEnabled } = this.props;
				const authorisedPaymentData = {
					type: GOOGLE_PAY,
					result: paymentData,
					checkoutId: checkout.id,
					paymentMethodId: _get(this.checkoutOption(), "id"),
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
				return { shippingContact, authorisedPaymentData };
			})
			.then(authorisedPaymentData => {
				const { onAuthorisedPayment } = this.props;
				onAuthorisedPayment(authorisedPaymentData);
			})
			.catch(e => {
				if (e.statusCode === "CANCELED") {
					onPaymentSheetClose();
				} else {
					this.toastError();
					onPaymentFailure();
					handleException(
						e,
						{ paymentRequest },
						"Could not authorise Google Pay payment"
					);
				}
			})
			.finally(() => {
				this.setState({ isLoading: false });
			});

		onPayButtonClick();
	};

	toastError = () => {
		const { toastManager } = this.props;
		setTimeout(() => {
			toastManager.add(
				`Could not process Google Pay Payment. Please contact Buyte Support`,
				{
					appearance: "error",
					autoDismiss: true,
					pauseOnHover: true
				}
			);
		}, 500);
	};

	getMerchantId = () =>
		_get(this.checkoutOption(), "additionalData.merchantId", "");

	getMerchantName = () =>
		_get(this.props, "checkout.merchant.storeName", "Buyte");

	isTestGatewayProvider = () =>
		_get(this.props, "checkout.gatewayProvider.isTest", false);

	onGPayScriptLoad = () => {
		const merchantInfo = {
			merchantName: this.getMerchantName(),
			merchantId: this.getMerchantId()
		};
		let environment = "TEST";
		if (
			!!isProd &&
			!!merchantInfo.merchantId &&
			!this.isTestGatewayProvider()
		) {
			environment = "PRODUCTION";
		}
		const settings = {
			environment,
			merchantInfo
		};
		this.client = new window.google.payments.api.PaymentsClient(settings);
		this.setState({ isReady: true });
		this.validate();
	};

	checkoutOption() {
		const { checkout, paymentOptionName } = this.props;
		return (
			checkout.options.find(({ name }) => name === paymentOptionName) || {}
		);
	}

	generateProductItems() {
		const { items } = this.props;
		return items.map(({ name, formatted, quantity = 1 }) => ({
			label: quantity > 1 ? `${quantity}x ${name}` : name,
			type: "LINE_ITEM",
			price: formatted
		}));
	}

	generatePaymentRequest() {
		const { checkout = {}, totalAmount, isShippingEnabled } = this.props;
		const { currency, gatewayProvider } = checkout;

		const totalAmountFloat = formatAmount(totalAmount);

		const lineItems = this.generateProductItems();
		if (isShippingEnabled) {
			lineItems.push({
				label: "Shipping",
				type: "LINE_ITEM",
				price: "0.00",
				status: "PENDING"
			});
		}

		const tokenizationSpecification = {
			type: "PAYMENT_GATEWAY",
			parameters: {
				gateway: gatewayProvider.name.toLowerCase(),
				gatewayMerchantId: gatewayProvider.publicKey
			}
		};
		// In alternative cases...
		switch (gatewayProvider.name.toUpperCase()) {
			case "STRIPE":
				tokenizationSpecification.parameters = {
					gateway: "stripe",
					"stripe:version": "2018-10-31",
					"stripe:publishableKey": gatewayProvider.publicKey
				};
				break;
			default:
				break;
		}
		const cardPaymentMethod = {
			...this.baseCardPaymentMethod,
			tokenizationSpecification
		};

		const paymentRequest = Object.assign(
			{},
			this.baseRequest,
			{
				allowedPaymentMethods: [cardPaymentMethod],
				transactionInfo: {
					totalPriceStatus: "ESTIMATED",
					totalPrice: totalAmountFloat,
					currencyCode: currency,
					displayItems: lineItems,
					totalPriceLabel: "Total"
				},
				merchantInfo: {
					merchantName: this.getMerchantName(),
					merchantId: this.getMerchantId()
				},
				emailRequired: true
			},
			isShippingEnabled
				? {
						shippingAddressRequired: true,
						shippingAddressParameters: {
							phoneNumberRequired: true
						}
				  }
				: {
						allowedPaymentMethods: [
							Object.assign({}, cardPaymentMethod, {
								parameters: {
									...cardPaymentMethod.parameters,
									billingAddressRequired: true,
									billingAddressParameters: {
										format: "FULL",
										phoneNumberRequired: true
									}
								}
							})
						]
				  }
		);

		return paymentRequest;
	}

	render() {
		const { isReady, isValid, isLoading } = this.state;
		const { buttonProps, onPayButtonHover } = this.props;
		return (
			<>
				<PayButton
					onClick={isReady && isValid && !isLoading ? this.onClick : null}
					isDisabled={!isValid || !isReady}
					isLoading={isLoading}
					onHover={onPayButtonHover}
					{...buttonProps}
				>
					<GooglePayLogo alt="Buyte: Google Pay" width={65} height={30} />
				</PayButton>
				<Script
					url="https://pay.google.com/gp/p/js/pay.js"
					onLoad={this.onGPayScriptLoad}
				/>
			</>
		);
	}
}

GooglePayButton.propTypes = PayButtonPropTypes;

GooglePayButton.defaultProps = PayButtonDefaultProps;

export default withToastManager(GooglePayButton);
