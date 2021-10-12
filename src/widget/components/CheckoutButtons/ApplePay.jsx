import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _get from "lodash.get";

import {
	addShowingButton as addShowingButtonAction,
	removeShowingButton as removeShowingButtonAction
} from "@/actions";
import { APPLE_PAY } from "@/constants/button-types";
import { ApplePayLogo } from "@/assets";
import Button from "@/shared-components/Button";

class ApplePay extends Component {
	componentDidMount() {
		const { addShowingButton } = this.props;
		addShowingButton(APPLE_PAY);
	}

	componentWillUnmount() {
		const { removeShowingButton } = this.props;
		removeShowingButton(APPLE_PAY);
	}

	onClick = async e => {
		e.preventDefault();
		e.stopPropagation();

		const { open, onButtonClick = () => {} } = this.props;

		await onButtonClick(APPLE_PAY);
		// Open Go Page.
		if (typeof open === "function") {
			open(APPLE_PAY);
		}
	};

	render() {
		const { isShown, isDark, onButtonHover = () => {}, isLoading } = this.props;

		return isShown ? (
			<Button
				isDark={isDark}
				onClick={this.onClick}
				onMouseOver={() => onButtonHover(APPLE_PAY)}
				onFocus={() => {}}
				isLoading={isLoading}
			>
				<ApplePayLogo
					isDark={isDark}
					width={55}
					height={25}
					alt="Buyte: Google Pay"
				/>
			</Button>
		) : null;
	}
}

ApplePay.propTypes = {
	isShown: PropTypes.bool,
	isDark: PropTypes.bool,
	isLoading: PropTypes.bool,
	open: PropTypes.func,
	onButtonClick: PropTypes.func,
	onButtonHover: PropTypes.func,
	removeShowingButton: PropTypes.func,
	addShowingButton: PropTypes.func
};

ApplePay.defaultProps = {
	isShown: false,
	isDark: false,
	isLoading: false,
	open: () => {},
	onButtonClick: () => {},
	onButtonHover: () => {},
	removeShowingButton: () => {},
	addShowingButton: () => {}
};

function mapStateToProps({ settings = {}, showingButtons }) {
	return {
		isShown: showingButtons.indexOf(APPLE_PAY) > -1,
		isDark: !!_get(settings, "options.dark", false)
	};
}
function mapDispatchToProps(dispatch) {
	return {
		addShowingButton(payload) {
			dispatch(addShowingButtonAction(payload));
		},
		removeShowingButton(payload) {
			dispatch(removeShowingButtonAction(payload));
		}
	};
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApplePay);
