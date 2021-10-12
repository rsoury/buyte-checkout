import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import urljoin from "url-join";
import isEmpty from "is-empty";
import Url from "url-parse";
import LZString from "lz-string";

import { getBackgroundInfo, handleException } from "@/utils/tracking";
import { CheckoutProps, SettingsProps } from "@/constants/common-prop-types";
import * as messageTypes from "@/constants/cross-origin-message-types";
import { goUrl } from "@/utils/env-config";
import { trigger } from "@/buyte/commands/callback-registry";

const STORE_QUERY_PARAM = "buyte-store";

class PageManager extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isReady: false
		};

		// A flag to determine whether to cleanup on page departure or not.
		this.isOpeningGoPayment = false;

		const url = new Url(window.location.href, true);
		this.store = null;
		if (Object.prototype.hasOwnProperty.call(url.query, STORE_QUERY_PARAM)) {
			this.store = url.query[STORE_QUERY_PARAM];
		}
	}

	// On component mount, establish connection to hub.
	componentDidMount() {
		this.initialise();
		window.onbeforeunload = () => this.beforeUnload();
		window.addEventListener("beforeunload", () => this.beforeUnload(), false);
	}

	async getData() {
		if (isEmpty(this.store)) {
			return {};
		}
		let data = LZString.decompressFromEncodedURIComponent(this.store);
		try {
			if (!isEmpty(data)) {
				data = JSON.parse(data);
			}
		} catch (e) {
			data = {};
		}
		return data;
	}

	async setData(data, overwrite = false) {
		let original = {};
		if (!overwrite) {
			original = await this.getData();
		}
		this.store = LZString.compressToEncodedURIComponent(
			JSON.stringify(Object.assign({}, original, data))
		);
	}

	// store payment data against key on open.
	open = async type => {
		if (!type) {
			return null;
		}
		const { settings, checkout, items } = this.props;

		// remove ?buyte-store from href... in case they aborted and would like to return.
		const url = this.removeStoreQueryParam();

		// Set init on open in order to use the current prop data before opening.
		try {
			await this.setData(
				{
					[messageTypes.OPEN]: {
						url: url.toString(),
						origin: url.host,
						type
					},
					[messageTypes.INIT]: {
						info: {
							...(getBackgroundInfo() || {})
						},
						app: {
							settings,
							checkout,
							items
						}
					}
				},
				true
			);
			this.isOpeningGoPayment = true;
			const targetUrl = urljoin(goUrl, `?store=${this.store}`);
			window.location.href = targetUrl;
		} catch (e) {
			handleException(e);
		}
		return null;
	};

	beforeUnload = () => {
		if (!this.isOpeningGoPayment) {
			this.cleanup();
		}
		return null;
	};

	removeStoreQueryParam = () => {
		const url = new Url(window.location.href, true);
		const { [STORE_QUERY_PARAM]: buyteStore, ...query } = url.query;
		url.set("query", query);
		return url;
	};

	async initialise() {
		const { onPaymentAuthorised, onAbort } = this.props;
		try {
			// once connected, get data from store.
			const data = await this.getData();
			if (!isEmpty(data)) {
				// If data exists, then user has returned from go payment.

				// check if receiving an authorised payment, or an abort, and if nothing, initialise go payment:
				const {
					[messageTypes.PAYMENT_AUTHORISED]: authorisedPaymentData
				} = data;
				if (!isEmpty(authorisedPaymentData)) {
					// is receiving authorised payment.
					onPaymentAuthorised(authorisedPaymentData);
				}

				// Check if just go payment was aborted.
				const { [messageTypes.CLOSE]: didClose } = data;
				if (typeof didClose === "boolean") {
					if (didClose) {
						// is receiving message about aborted go payment
						onAbort();
					}
				}
			}

			// after handling data received, cleanup, set a new store
			this.cleanup();

			this.setState({ isReady: true });
		} catch (e) {
			handleException(e);
			trigger("onError")("LOAD_ERROR");
		}
	}

	// Clean up will reset the store and remove existing query param
	cleanup() {
		this.store = null;
		const url = this.removeStoreQueryParam();
		window.history.replaceState(
			{},
			document.title,
			url.href.replace(url.origin, "")
		);
	}

	render() {
		const { children } = this.props;
		const { isReady } = this.state;
		const props = {
			open: this.open
		};
		// Only set isLoading to true if isReady is false.
		// This way when Manager is ready, isLoading is handled by any other component. ie CheckoutButtons component.
		if (!isReady) {
			props.isLoading = true;
		}
		const clonedChildren = React.Children.map(children, child =>
			React.cloneElement(child, props)
		);
		return clonedChildren;
	}
}

PageManager.propTypes = {
	settings: SettingsProps,
	checkout: CheckoutProps,
	items: PropTypes.arrayOf(PropTypes.object),
	onPaymentAuthorised: PropTypes.func,
	onAbort: PropTypes.func,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};

PageManager.defaultProps = {
	settings: {},
	checkout: {},
	items: [],
	onPaymentAuthorised: () => {},
	onAbort: () => {},
	children: undefined
};

export default connect(function mapStateToProps({
	settings = {},
	checkout = {},
	items = []
}) {
	return {
		settings,
		checkout,
		items
	};
})(PageManager);
