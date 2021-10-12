import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AcrossTabs from "across-tabs";

import { getBackgroundInfo } from "@/utils/tracking";
import { CheckoutProps, SettingsProps } from "@/constants/common-prop-types";
import * as messageTypes from "@/constants/cross-origin-message-types";
import { goUrl } from "@/utils/env-config";

class TabManager extends Component {
	childTab = null;

	TabOpener = null;

	componentDidMount() {
		const onChildCommunication = ({ message, data }) => {
			this.communicationHub(message, data);
		};
		this.TabOpener = new AcrossTabs.Parent({
			removeClosedTabs: true,
			onChildCommunication
		});
		window.onbeforeunload = () => this.closeRemainingTabs();
		window.addEventListener(
			"beforeunload",
			() => this.closeRemainingTabs(),
			false
		);
	}

	closeRemainingTabs = () => {
		this.TabOpener.closeAllTabs();
		this.childTab = null;
		return null;
	};

	open = type => {
		if (!type) {
			return;
		}
		this.TabOpener.closeAllTabs();
		this.childTab = this.TabOpener.openNewTab({
			url: goUrl,
			name: `Buyte:${type}`
		});
	};

	communicationHub(message, data) {
		const {
			settings,
			checkout,
			items,
			onPaymentAuthorised,
			onAbort
		} = this.props;
		switch (message) {
			case messageTypes.READY:
				// On Ready, send payment request.
				this.TabOpener.broadCastTo(this.childTab.id, {
					message: messageTypes.INIT,
					data: {
						info: {
							...(getBackgroundInfo() || {})
						},
						app: {
							settings,
							checkout,
							items
						}
					}
				});
				break;
			case messageTypes.PAYMENT_AUTHORISED:
				onPaymentAuthorised(data);
				this.closeRemainingTabs();
				break;
			case messageTypes.CLOSE:
				onAbort();
				break;
			default:
				break;
		}
	}

	render() {
		const { children } = this.props;
		const clonedChildren = React.Children.map(children, child =>
			React.cloneElement(child, {
				open: this.open
			})
		);
		return clonedChildren;
	}
}

TabManager.propTypes = {
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

TabManager.defaultProps = {
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
})(TabManager);
