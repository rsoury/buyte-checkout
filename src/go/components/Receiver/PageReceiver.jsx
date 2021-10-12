/* This component takes care of receiving data from Store regardless of Manager used */

import React, { Component } from "react";
import PropTypes from "prop-types";
import urljoin from "url-join";
import isEmpty from "is-empty";
import Url from "url-parse";
import LZString from "lz-string";

import * as messageTypes from "@/constants/cross-origin-message-types";
import * as eventTypes from "@/constants/event-tracking-types";
import { initTracking, track, handleException } from "@/utils/tracking";

const STORE_QUERY_PARAM = "store";

class PageReceiver extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]).isRequired
	};

	static defaultProps = {};

	constructor(props) {
		super(props);

		this.state = {
			app: null
		};
		this.data = {};
		this.pageContext = {};

		const url = new Url(window.location.href, true);
		this.store = null;
		if (Object.prototype.hasOwnProperty.call(url.query, STORE_QUERY_PARAM)) {
			this.store = url.query[STORE_QUERY_PARAM];
		}
	}

	async componentDidMount() {
		try {
			await Promise.all([this.loadContext(), this.initialise()]);
		} catch (e) {
			handleException(e);
		}
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

	getType = () => this.pageContext.type;

	backToShop = () => {
		const { url } = this.pageContext;
		if (url) {
			window.location.replace(urljoin(url, `?buyte-store=${this.store}`));
		}
	};

	close = async () => {
		track(eventTypes.GO_CLOSE);
		await this.setData(
			{
				[messageTypes.CLOSE]: true
			},
			true
		);
		this.backToShop();
	};

	onAuthorisedPayment = async authorisedPaymentData => {
		// Set payment token in store
		track(eventTypes.GO_PAYMENT_AUTHORISED, authorisedPaymentData);
		await this.setData(
			{
				[messageTypes.PAYMENT_AUTHORISED]: authorisedPaymentData
			},
			true
		);
		this.backToShop();
	};

	async initialise() {
		const storeData = await this.getData();
		if (isEmpty(storeData)) {
			return;
		}
		const { [messageTypes.INIT]: data = {} } = storeData;
		if (!isEmpty(data)) {
			const { info, app } = data;
			initTracking(true, info.deviceId);

			const newState = {
				app: {
					...app,
					type: this.getType()
				}
			};
			this.setState(newState);

			track(eventTypes.GO_LOADED, newState);
		}
	}

	async loadContext() {
		const storeData = await this.getData();
		if (isEmpty(storeData)) {
			return;
		}
		const { [messageTypes.OPEN]: data = {} } = storeData;
		if (!isEmpty(data)) {
			this.pageContext = { ...data };
		}
	}

	render() {
		const { children } = this.props;
		const { app } = this.state;

		return React.Children.map(children, child =>
			React.cloneElement(child, {
				app,
				close: this.close,
				onAuthorisedPayment: this.onAuthorisedPayment
			})
		);
	}
}

export default PageReceiver;
