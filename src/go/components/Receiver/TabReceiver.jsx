/* This component takes care of receiving data from AcrossTabs */

import React, { Component } from "react";
import PropTypes from "prop-types";
import AcrossTabs from "across-tabs";

import * as messageTypes from "@/constants/cross-origin-message-types";
import * as eventTypes from "@/constants/event-tracking-types";
import { initTracking, track } from "@/utils/tracking";

class TabReceiver extends Component {
	state = {
		app: null
	};

	tab = new AcrossTabs.Child({
		onParentDisconnect: this.onParentDisconnect.bind(this),
		onParentCommunication: this.onParentCommunication.bind(this)
	});

	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]).isRequired
	};

	static defaultProps = {};

	componentDidMount() {
		this.tab.sendMessageToParent({
			message: messageTypes.READY
		});
	}

	onParentDisconnect() {
		// Close this window...
		this.close();
		// window.close();
	}

	onParentCommunication({ message, data = {} }) {
		if (message === messageTypes.INIT) {
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

	getType = () => this.tab.tabName.replace("Buyte:", "");

	close = () => {
		this.tab.sendMessageToParent({
			message: messageTypes.CLOSE
		});
		track(eventTypes.GO_CLOSE);
		window.close();
	};

	onAuthorisedPayment = authorisedPaymentData => {
		// Send payment token to parent window
		this.tab.sendMessageToParent({
			message: messageTypes.PAYMENT_AUTHORISED,
			data: authorisedPaymentData
		});
		track(eventTypes.GO_PAYMENT_AUTHORISED, authorisedPaymentData);
		window.close();
	};

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

export default TabReceiver;
