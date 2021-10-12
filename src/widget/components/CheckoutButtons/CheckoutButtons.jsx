import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import isEmpty from "is-empty";
import _snakeCase from "lodash.snakecase";
import _cloneDeep from "lodash.clonedeep";
import _get from "lodash.get";
import { trigger, triggerExists } from "@/buyte/commands/callback-registry";

import { CheckoutProps } from "@/constants/common-prop-types";
import * as buttonTypes from "@/constants/button-types";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";
import {
	loadShippingMethods as loadShippingMethodsAction,
	updateAuthorisedPayment as updateAuthorisedPaymentAction
} from "@/actions";
import isProd from "@/utils/is-prod";

// import Footer from "./Footer";
import ApplePay from "./ApplePay";
import GooglePay from "./GooglePay";
import Manager from "./Manager";

const Container = styled.div`
	position: relative;
	overflow: hidden;
`;
const Body = styled.div`
	border-bottom: 0 !important;
	opacity: ${props => (props.isEnabled ? 1 : 0.35)};
	pointer-events: ${props => (props.isEnabled ? "auto" : "none")};
`;

const { ApplePaySession } = window;

class CheckoutButtons extends Component {
	state = {
		buttonsLoading: false
	};

	ApplePaySession = ApplePaySession;

	componentDidMount() {
		track(eventTypes.WIDGET_LOADED);

		// Debug confirm dialog if development environment.
		if (!isProd) {
			this.debugConfirmDialog();
		}
	}

	onPaymentAuthorised = ({ shippingContact = {}, authorisedPaymentData }) => {
		const {
			isShippingEnabled,
			loadShippingMethods,
			updateAuthorisedPayment
		} = this.props;
		// Trigger confirm popup before user code provides shipping methods.
		updateAuthorisedPayment(authorisedPaymentData);
		// This little wait helped... I think it allows safari tab to load again before setting a new state
		if (isShippingEnabled) {
			setTimeout(() => {
				this.setState({ buttonsLoading: true });
			}, 100);
			trigger("onShippingRequired")(shippingContact, (shippingMethods = []) => {
				loadShippingMethods(_cloneDeep(shippingMethods));
				this.setState({ buttonsLoading: false });
			});
		}
		trigger("onAuthentication")();
	};

	onButtonClick = type => {
		track(eventTypes.WIDGET_BUTTON_CLICK, { type });
		if (!triggerExists("onStart")) {
			return Promise.resolve();
		}
		return new Promise(resolve => {
			this.setState({ buttonsLoading: true });
			trigger("onStart")(`${type}`, () => {
				this.setState({ buttonsLoading: false });
				resolve();
			});
		});
	};

	onBrandClick = () => track(eventTypes.WIDGET_BRAND_CLICK);

	onAbort = () => {
		trigger("onAbort")();
	};

	getPaymentOption(type) {
		const {
			checkout: { options }
		} = this.props;
		if (!isEmpty(options)) {
			return options.find(
				({ name }) => _snakeCase(name).toUpperCase() === type
			);
		}
		return null;
	}

	debugConfirmDialog() {
		import("@/utils/debug")
			.then(m => (m.default ? m.default : m))
			.then(({ getPaymentAuthorisation }) => getPaymentAuthorisation())
			.then(data => {
				if (data) {
					this.onPaymentAuthorised(data);
				}
			});
	}

	isApplePayActive() {
		const option = this.getPaymentOption(buttonTypes.APPLE_PAY);
		if (!isEmpty(option)) {
			if (this.ApplePaySession) {
				if (this.ApplePaySession.canMakePayments) {
					return true;
				}
			}
		}
		return false;
	}

	isGooglePayActive() {
		const { checkout } = this.props;
		const option = this.getPaymentOption(buttonTypes.GOOGLE_PAY);
		if (!isEmpty(option)) {
			// if is prod, and gateway is not test but merchant id is missing return false, else return true.
			const merchantId = _get(option, "additionalData.merchantId", "");
			const isTestGatewayProvider = _get(
				checkout,
				"gatewayProvider.isTest",
				false
			);
			if (isProd && !isTestGatewayProvider) {
				// is live gateway on production env
				return !isEmpty(merchantId); // return true if merchant id exists
			}
			return true;
		}
		return false;
	}

	/*
		If checkout empty, then must be loading.
		If checkout, not empty, then if options available?
			If yes, load only buttons that are in the payload, else don't load anything.
	*/
	render() {
		const { checkout, isEnabled, isLoading } = this.props;
		const { buttonsLoading } = this.state;
		const isButtonsLoading = buttonsLoading || isLoading;

		if (isEmpty(checkout)) {
			return null;
		}

		let options = [];
		if (this.isApplePayActive()) {
			options.push({
				ButtonComponent: ApplePay,
				key: buttonTypes.APPLE_PAY
			});
		}
		if (this.isGooglePayActive()) {
			options.push({
				ButtonComponent: GooglePay,
				key: buttonTypes.GOOGLE_PAY
			});
		}

		if (options.length === 0) {
			return null;
		}

		// Append __loading to keys for a successful rerender
		if (isButtonsLoading) {
			options = options.map(({ key, ...option }) => {
				const loadingKey = `${key}__loading`;
				return {
					key: loadingKey,
					...option
				};
			});
		}

		return (
			<Container>
				<Body isEnabled={isEnabled}>
					<Manager
						onPaymentAuthorised={this.onPaymentAuthorised}
						onAbort={this.onAbort}
					>
						{options.map(({ ButtonComponent, key }) => (
							<ButtonComponent
								key={key}
								onButtonClick={this.onButtonClick}
								isLoading={isButtonsLoading}
							/>
						))}
					</Manager>
				</Body>
				{/* <Footer onClick={this.onBrandClick} /> */}
			</Container>
		);
	}
}

CheckoutButtons.propTypes = {
	loadShippingMethods: PropTypes.func,
	updateAuthorisedPayment: PropTypes.func,
	checkout: CheckoutProps,
	isEnabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	isShippingEnabled: PropTypes.bool
};
CheckoutButtons.defaultProps = {
	loadShippingMethods: () => {},
	updateAuthorisedPayment: () => {},
	checkout: {},
	isEnabled: true,
	isLoading: false,
	isShippingEnabled: false
};

export default connect(
	function mapStateToProps({
		checkout,
		isEnabled,
		isLoading,
		isShippingEnabled
	}) {
		return {
			checkout,
			isEnabled,
			isLoading,
			isShippingEnabled
		};
	},
	function mapDispatchToProps(dispatch) {
		return {
			loadShippingMethods(...args) {
				return dispatch(loadShippingMethodsAction(...args));
			},
			updateAuthorisedPayment(...args) {
				return dispatch(updateAuthorisedPaymentAction(...args));
			}
		};
	}
)(CheckoutButtons);
