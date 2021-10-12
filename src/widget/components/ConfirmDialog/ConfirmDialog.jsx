import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import isEmpty from "is-empty";
import { Transition } from "react-transition-group";
import ResizeDetector from "react-resize-detector";
import ScrollLock from "react-scrolllock";
import _get from "lodash.get";

import {
	updateAuthorisedPayment as updateAuthorisedPaymentAction,
	createPaymentToken as createPaymentTokenAction
} from "@/actions";
import {
	AuthorisedPaymentDataProps,
	ItemsProps,
	ShippingMethodsProps,
	PaymentTokenProps
} from "@/constants/common-prop-types";
import * as colors from "@/constants/colors";
import * as itemTypes from "@/constants/valid-item-types";
import theme from "@/utils/theme";
import AuthorisedPayment from "@/utils/authorised-payment";
import ItemsHelper from "@/utils/items";
import isProd from "@/utils/is-prod";
import { formatAmount } from "@/utils/amount";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";

import StyledFrame from "../StyledFrame";
import Order from "./Order";
import Details from "./Details";
import Close from "./Close";

const FrameGlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,600,700,900&display=swap');
	body, html {
		margin: 0;
		padding: 0;
	}
`;
const Frame = styled(StyledFrame)`
	overflow: hidden;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 99999999999;
	width: 100vw;
	height: 100vh;
`;
const Overlay = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 5;
	transition: opacity 0.25s, visibility 0.25s, background-color 0.25s;
	background-color: ${({ state }) =>
		state === "entered" ? "rgba(12, 15, 33, 0.8)" : "rgba(12, 15, 33, 0)"};
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	@media (min-width: 480px) and (min-height: ${props =>
			`${props.theme.minimumHeightForElevation}px`}) {
		display: flex;
		align-items: center;
		justify-contents: center;
		overflow: hidden;
	}
	@media (min-width: 480px) {
		padding: 20px;
	}
`;
const Container = styled.div`
	font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont,
		"Helvetica Neue", "Helvetica", "Arial", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: ${() => colors.BLACK};
	max-width: 768px;
	margin: 0 auto;
	width: 100%;
	background-color: #fff;
	min-height: 100%;
	opacity: ${({ state }) => (state === "entered" ? 1 : 0)};
	visiblity: ${({ state }) => (state === "entered" ? "visible" : "hidden")};
	transform: ${({ state }) =>
		state === "entered" ? "translateY(0)" : "translateY(20px)"};
	transition: opacity 0.25s, visibility 0.25s, transform 0.25s;
	@media (min-width: 480px) {
		min-height: auto !important;
		border-radius: 4px;
		overflow: hidden;
		box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
			0 18px 36px -18px rgba(0, 0, 0, 0.3),
			0 -12px 36px -8px rgba(0, 0, 0, 0.025);
	}
`;
const Body = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: stretch;
	justify-content: center;
	padding-top: 5px;
	@media (max-width: 767px) {
		flex-direction: column-reverse;
	}
	@media (min-width: 768px) {
		& > div {
			&:nth-child(1) {
				width: 60%;
			}
			&:nth-child(2) {
				width: 40%;
			}
		}
	}
	&:before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 5px;
		background-image: linear-gradient(
			135deg,
			${colors.SECONDARY_DARK} 25%,
			${colors.SECONDARY_LIGHT} 25%,
			${colors.SECONDARY_LIGHT} 50%,
			${colors.SECONDARY_DARK} 50%,
			${colors.SECONDARY_DARK} 75%,
			${colors.SECONDARY_LIGHT} 75%,
			${colors.SECONDARY_LIGHT} 100%
		);
		background-size: 56.57px 56.57px;
	}
`;

class ConfirmDialog extends Component {
	state = {
		isRendered: false,
		isOpen: false,
		minimumHeightForElevation: 500,
		payButtonLoading: false,
		shippingMethods: [],
		selectedShippingMethodId: ""
	};

	dialog = React.createRef();

	abortCheckMessage = "Are you sure you would like to abort the checkout?";

	static getDerivedStateFromProps(nextProps, prevState) {
		const isRendered = !isEmpty(nextProps.authorisedPaymentData);
		if (isRendered !== prevState.isRendered) {
			return { isRendered };
		}
		// If in the process of incoming shipping methods
		if (
			!isEmpty(nextProps.shippingMethods) &&
			isEmpty(prevState.shippingMethods)
		) {
			return {
				shippingMethods: nextProps.shippingMethods
			};
		}
		return null;
	}

	componentDidMount() {
		if (isProd) {
			window.onbeforeunload = e => this.beforeUnload(e);
			window.addEventListener("beforeunload", e => this.beforeUnload(e), false);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { isRendered, shippingMethods } = this.state;
		const { paymentToken } = this.props;
		if (isEmpty(prevProps.authorisedPaymentData) && isRendered) {
			track(eventTypes.CONFIRM_LOADED);
			setTimeout(() => {
				this.setState({ isOpen: true });
			}, 100);
		}
		// if isRendered went from true to false, set state back to default.
		if (prevState.isRendered && !isRendered) {
			setTimeout(() => {
				this.setState({
					payButtonLoading: false,
					selectedShippingMethodId: this.resetShippingMethod()
				});
			}, 100);
		}
		// Set the default shipping method here in case the bare lowest rate method is unavailable to the current order.
		if (prevProps.shippingMethods.length === 0 && shippingMethods.length > 0) {
			track(eventTypes.CONFIRM_SHIPPING_LOADED, shippingMethods);
			setTimeout(() => {
				this.setState({
					selectedShippingMethodId: this.resetShippingMethod()
				});
			}, 100);
		}
		// If paymentToken has gone from empty to not empty, close the confirmation page and reset to default.
		const isPaymentTokenCreated = !isEmpty(paymentToken);
		if (isEmpty(prevProps.paymentToken) && isPaymentTokenCreated) {
			track(eventTypes.CONFIRM_TOKEN_CREATED, paymentToken);
			this.close();
			setTimeout(() => {
				this.setState({
					payButtonLoading: false,
					selectedShippingMethodId: this.resetShippingMethod()
				});
			}, 500);
		}
	}

	// A callback whenever the dialog height (... or width -- if prop is set on resize component) resizes.
	getDialogHeight() {
		if (!isEmpty(this.dialog.current)) {
			return (
				this.dialog.current.clientHeight ||
				this.dialog.current.offsetHeight ||
				this.dialog.current.scrollHeight
			);
		}
		return 500;
	}

	// A function used to get the "available" methods from the ones submitted.
	// Makes sure used shipping methods comply with the max/min order requirements.
	getAvailableShippingMethods() {
		const { items } = this.props;
		const { shippingMethods } = this.state;

		const itemsHelper = new ItemsHelper(items);
		const productTotal = itemsHelper.getTotalForType(itemTypes.PRODUCT, true);

		const methods = shippingMethods.filter(({ minOrder, maxOrder }) => {
			if (typeof maxOrder !== "undefined") {
				// By default, shipping order max order is null
				if (maxOrder !== null) {
					if (productTotal > maxOrder) {
						return false;
					}
				}
			}
			if (productTotal < minOrder) {
				return false;
			}
			return true;
		});

		// Sort shipping methods from lowest to highest cost
		methods.sort((a, b) => {
			if (a.rate < b.rate) {
				return -1;
			}
			if (a.rate > b.rate) {
				return 1;
			}
			return 0;
		});

		return methods;
	}

	resetShippingMethod = (setState = false) => {
		const defaultMethod = _get(
			this.getAvailableShippingMethods(),
			["0", "id"],
			""
		);
		if (setState) {
			this.setState({ selectedShippingMethodId: defaultMethod });
		}
		return defaultMethod;
	};

	abort = () => {
		if (this.confirmClose()) {
			track(eventTypes.CONFIRM_ABORT);
		}
	};

	/* eslint-disable no-alert */
	confirmClose = () => {
		const confirm = window.confirm(this.abortCheckMessage);
		if (confirm) {
			this.close();
		}
		return confirm;
	};

	close = () => {
		const { updateAuthorisedPayment } = this.props;
		this.setState({ isOpen: false });
		setTimeout(() => {
			updateAuthorisedPayment(null);
		}, 500);
	};

	// See: https://stackoverflow.com/questions/3888902/detect-browser-or-tab-closing
	beforeUnload = e => {
		const { isRendered } = this.state;
		if (isRendered) {
			const confirmationMessage = this.abortCheckMessage;

			(e || window.event).returnValue = confirmationMessage;
			return confirmationMessage;
		}

		return null;
	};

	// Callback on pay click.
	// send selected shipping method to createPaymenToken.
	onPay = () => {
		const { createPaymentToken, isShippingEnabled, items } = this.props;
		const { selectedShippingMethodId } = this.state;
		this.setState({ payButtonLoading: true });
		track(eventTypes.CONFIRM_PAYMENT, {
			shipping: isShippingEnabled,
			selectedShippingMethodId,
			items
		});
		createPaymentToken(selectedShippingMethodId);
	};

	onShippingMethodSelect = methodId => {
		const { selectedShippingMethodId } = this.state;
		if (!isEmpty(methodId)) {
			if (methodId !== selectedShippingMethodId) {
				const newState = { selectedShippingMethodId: methodId };
				track(eventTypes.CONFIRM_SHIPPING_CHANGED, newState);
				this.setState(newState);
			}
		}
	};

	onDialogResize = (width, height) => {
		this.setState({
			minimumHeightForElevation: height
		});
	};

	render() {
		const { authorisedPaymentData, items, isShippingEnabled } = this.props;
		const {
			isRendered,
			isOpen,
			minimumHeightForElevation,
			payButtonLoading,
			selectedShippingMethodId
		} = this.state;
		const ap = AuthorisedPayment(authorisedPaymentData);
		const itemsHelper = new ItemsHelper(items);
		const shippingMethods = this.getAvailableShippingMethods();

		// Use currently selected shipping method to change total.
		let total = itemsHelper.getTotalForType(null, true);
		let shippingTotal = itemsHelper.getTotalForType(itemTypes.SHIPPING, true);
		if (isShippingEnabled) {
			const method = shippingMethods.find(
				({ id }) => id === selectedShippingMethodId
			);
			if (!isEmpty(method)) {
				const { rate = 0 } = method;
				total += rate;
				shippingTotal += rate;
			}
		}
		const totalAmount = formatAmount(total);
		const shippingTotalAmount = formatAmount(shippingTotal);

		const detailsProps = {
			paymentType: ap.getType(),
			contact: ap.getContact(),
			shippingAddress: ap.getShippingAddress(),
			billingAddress: ap.getBillingAddress(),
			payment: ap.getPayment(),
			enableShipping: isShippingEnabled,
			totalAmount,
			onPay: this.onPay,
			shippingMethods,
			selectedShippingMethodId,
			onShippingMethodSelect: this.onShippingMethodSelect,
			payButtonProps: {
				isLoading: payButtonLoading
			}
		};
		const orderProps = {
			products: itemsHelper.getProducts(),
			productTotal: itemsHelper.getTotalForType(itemTypes.PRODUCT),
			enableShipping: isShippingEnabled, // Use this because only show shipping output if explicitly enabled.
			shippingTotal: isEmpty(selectedShippingMethodId)
				? " ... "
				: shippingTotalAmount,
			taxTotal: itemsHelper.getTotalForType(itemTypes.TAX),
			discountTotal: itemsHelper.getTotalForType(itemTypes.DISCOUNT),
			creditTotal: itemsHelper.getTotalForType(itemTypes.CREDIT),
			totalAmount
		};

		return (
			isRendered && (
				<>
					<Frame
						theme={{
							...theme,
							minimumHeightForElevation
						}}
					>
						<ScrollLock>
							<FrameGlobalStyle />
							<Transition in={isOpen} timeout={250}>
								{state => (
									<Overlay state={state}>
										<Transition in={state === "entered"} timeout={250}>
											{containerState => (
												<Container state={containerState}>
													<Close onClick={this.abort} />
													<Body>
														<Details {...detailsProps} />
														<Order compact {...orderProps} />
													</Body>
													<ResizeDetector
														handleHeight
														onResize={this.onDialogResize}
													/>
												</Container>
											)}
										</Transition>
									</Overlay>
								)}
							</Transition>
						</ScrollLock>
					</Frame>
				</>
			)
		);
	}
}

ConfirmDialog.propTypes = {
	authorisedPaymentData: AuthorisedPaymentDataProps,
	items: ItemsProps,
	updateAuthorisedPayment: PropTypes.func,
	createPaymentToken: PropTypes.func,
	isShippingEnabled: PropTypes.bool,
	shippingMethods: ShippingMethodsProps,
	paymentToken: PaymentTokenProps
};
ConfirmDialog.defaultProps = {
	authorisedPaymentData: null,
	items: [],
	updateAuthorisedPayment: () => {},
	createPaymentToken: () => {},
	isShippingEnabled: false,
	shippingMethods: [],
	paymentToken: null
};

export default connect(
	function mapStateToProps({
		authorisedPaymentData,
		shippingMethods,
		isShippingEnabled,
		items,
		paymentToken
	}) {
		return {
			authorisedPaymentData,
			shippingMethods,
			isShippingEnabled,
			items,
			paymentToken
		};
	},
	function mapDispatchToProps(dispatch) {
		return {
			updateAuthorisedPayment(...args) {
				return dispatch(updateAuthorisedPaymentAction(...args));
			},
			createPaymentToken(...args) {
				return dispatch(createPaymentTokenAction(...args));
			}
		};
	}
)(ConfirmDialog);
