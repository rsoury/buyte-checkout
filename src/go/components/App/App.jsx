import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "is-empty";
import Helmet from "react-helmet";
import _startCase from "lodash.startcase";
import _get from "lodash.get";

import initApi from "@/api";
import * as buttonTypes from "@/constants/button-types";
import * as itemTypes from "@/constants/valid-item-types";
import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";
import { formatAmount } from "@/utils/amount";
import ItemsHelper from "@/utils/items";

import Header from "../Header";
import Overview from "../Overview";
import Payment from "../Payment";
import Order from "../Order";
import Spacer from "../Spacer";
import LoaderScreen from "../LoaderScreen";
import Toaster from "../Toaster";
import ApplePayButton from "../ApplePayButton";
import GooglePayButton from "../GooglePayButton";

import { Page, Main, Body } from "./styles";

class App extends Component {
	state = {
		isLoading: true,
		type: "",
		settings: {},
		checkout: {},
		items: [],
		minimumHeightForElevation: 700
	};

	body = React.createRef();

	static propTypes = {
		app: PropTypes.shape({
			type: PropTypes.string,
			settings: PropTypes.object,
			checkout: PropTypes.object,
			items: PropTypes.arrayOf(PropTypes.object)
		}),
		close: PropTypes.func,
		onAuthorisedPayment: PropTypes.func
	};

	static defaultProps = {
		app: null,
		close() {},
		onAuthorisedPayment() {}
	};

	static getDerivedStateFromProps(nextProps) {
		if (!isEmpty(nextProps.app)) {
			return { ...nextProps.app };
		}
		return null;
	}

	componentDidMount() {
		if (!isEmpty(this.body.current)) {
			this.setState({
				minimumHeightForElevation:
					this.body.current.clientHeight ||
					this.body.current.offsetHeight ||
					this.body.current.scrollHeight
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// When payment method is set, trigger a timeout of 250ms before isLoading is set to false.
		const { type } = this.state;
		if (prevState.type !== type) {
			setTimeout(() => {
				this.setState({ isLoading: false });
			}, 250);
		}
	}

	getPaymentOptionName = () => {
		const { type } = this.state;
		return _startCase(
			type
				.split("_")
				.join(" ")
				.toLowerCase()
		);
	};

	onPaymentFailure = () => track(eventTypes.GO_PAYMENT_UNAUTHORISED);

	onPaymentSheetOpen = () => track(eventTypes.GO_PAYMENT_SHEET_OPENED);

	onPaymentSheetClose = () => track(eventTypes.GO_PAYMENT_SHEET_CLOSED);

	onPayButtonClick = () => track(eventTypes.GO_PAY_BUTTON_CLICK);

	onBrandClick = () => track(eventTypes.GO_BRAND_CLICK);

	render() {
		const {
			isLoading,
			type,
			checkout,
			items,
			settings,
			minimumHeightForElevation
		} = this.state;
		const { close, onAuthorisedPayment } = this.props;

		if (isLoading) {
			return <LoaderScreen />;
		}

		const itemsHelper = new ItemsHelper(items);

		const { storeName } = checkout.merchant;
		const totalAmount = itemsHelper.getTotalForType(null, true);
		const shippingTotal = itemsHelper.getTotalForType(itemTypes.SHIPPING, true);
		const overviewProps = {
			storeName,
			totalAmount: formatAmount(totalAmount)
		};
		const orderProps = {
			products: itemsHelper.getProducts(),
			productTotal: itemsHelper.getTotalForType(itemTypes.PRODUCT),
			enableShipping: shippingTotal > 0,
			shippingTotal: formatAmount(shippingTotal),
			taxTotal: itemsHelper.getTotalForType(itemTypes.TAX),
			discountTotal: itemsHelper.getTotalForType(itemTypes.DISCOUNT),
			creditTotal: itemsHelper.getTotalForType(itemTypes.CREDIT),
			totalAmount: formatAmount(totalAmount)
		};
		const paymentOptionName = this.getPaymentOptionName();
		const payButtonProps = {
			items,
			checkout,
			isShippingEnabled: _get(settings, "options.shipping", false),
			actions: initApi(settings.publicKey),
			paymentOptionName,
			buttonProps: {},
			onAuthorisedPayment,
			onPaymentFailure: this.onPaymentFailure,
			onPaymentSheetOpen: this.onPaymentSheetOpen,
			onPaymentSheetClose: this.onPaymentSheetClose,
			onPayButtonClick: this.onPayButtonClick,
			totalAmount
		};

		return (
			<Toaster>
				<Page minimumHeightForElevation={minimumHeightForElevation}>
					<Helmet>
						<title>{`Checkout at ${storeName} with ${paymentOptionName}`}</title>
						<link
							href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,600,700,900"
							rel="stylesheet"
						/>
						<style type="text/css">{`
						body {
							background-color: #fff;
						}
						body * {
							box-sizing: border-box;
						}
						@media (min-width: 1025px) and (min-height: ${minimumHeightForElevation}px) {
							html, body, #root {
								height: 100%;
							}
						}
					`}</style>
					</Helmet>
					<Main
						ref={this.body}
						minimumHeightForElevation={minimumHeightForElevation}
					>
						<Header close={close} />
						<Body>
							<Overview {...overviewProps} />
							<Spacer />
							<Payment>
								{type === buttonTypes.APPLE_PAY && (
									<ApplePayButton {...payButtonProps} />
								)}
								{type === buttonTypes.GOOGLE_PAY && (
									<GooglePayButton {...payButtonProps} />
								)}
							</Payment>
							<Spacer />
							<Order {...orderProps} />
						</Body>
					</Main>
				</Page>
			</Toaster>
		);
	}
}

export default App;
