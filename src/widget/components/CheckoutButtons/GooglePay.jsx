import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _get from "lodash.get";

import {
	addShowingButton as addShowingButtonAction,
	removeShowingButton as removeShowingButtonAction
} from "@/actions";
import { GOOGLE_PAY } from "@/constants/button-types";
import { GooglePayLogo } from "@/assets";
import Button from "@/shared-components/Button";

class GooglePay extends Component {
	componentDidMount() {
		const { addShowingButton } = this.props;
		addShowingButton(GOOGLE_PAY);
	}

	componentWillUnmount() {
		const { removeShowingButton } = this.props;
		removeShowingButton(GOOGLE_PAY);
	}

	onClick = async e => {
		e.preventDefault();
		e.stopPropagation();

		const { open, onButtonClick = () => {} } = this.props;

		await onButtonClick(GOOGLE_PAY);
		// Open Go Page.
		if (typeof open === "function") {
			open(GOOGLE_PAY);
		}
	};

	render() {
		const { isShown, isDark, onButtonHover, isLoading } = this.props;

		return isShown ? (
			<Button
				isDark={isDark}
				onClick={this.onClick}
				onMouseOver={() => onButtonHover(GOOGLE_PAY)}
				onFocus={() => {}}
				isLoading={isLoading}
			>
				<GooglePayLogo
					isDark={isDark}
					width={55}
					height={25}
					alt="Buyte: Google Pay"
				/>
			</Button>
		) : null;
	}
}

GooglePay.propTypes = {
	isShown: PropTypes.bool,
	isDark: PropTypes.bool,
	isLoading: PropTypes.bool,
	open: PropTypes.func,
	onButtonClick: PropTypes.func,
	onButtonHover: PropTypes.func,
	removeShowingButton: PropTypes.func,
	addShowingButton: PropTypes.func
};

GooglePay.defaultProps = {
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
		isShown: showingButtons.indexOf(GOOGLE_PAY) > -1,
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
)(GooglePay);
