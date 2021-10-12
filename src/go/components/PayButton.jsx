import React from "react";
import PropTypes from "prop-types";
import isEmpty from "is-empty";

import Button, {
	PayButtonWrapper as Wrapper
} from "@/shared-components/Button";

const PayButton = ({
	children,
	onClick,
	onHover,
	isDisabled,
	isLoading,
	buttonProps
}) => (
	<Wrapper isDisabled={isDisabled} isLoading={isLoading}>
		<Button
			onClick={onClick}
			onMouseOver={onHover}
			onFocus={() => {}}
			isLoading={isLoading}
			{...buttonProps}
		>
			{!isEmpty(children) ? (
				children
			) : (
				<div style={{ color: "#fff" }}>Pay Button Unavailable</div>
			)}
		</Button>
	</Wrapper>
);

PayButton.propTypes = {
	onClick: PropTypes.func,
	onHover: PropTypes.func,
	isDisabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]),
	buttonProps: PropTypes.shape({
		backgroundColor: PropTypes.string,
		color: PropTypes.string
	})
};

PayButton.defaultProps = {
	onClick: () => {},
	onHover: () => {},
	isDisabled: false,
	isLoading: false,
	children: undefined,
	buttonProps: {}
};

// PropTypes for higher level pay buttons.
export const PayButtonPropTypes = {
	items: PropTypes.array.isRequired,
	checkout: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
	paymentOptionName: PropTypes.string.isRequired,
	onAuthorisedPayment: PropTypes.func.isRequired,
	onPaymentFailure: PropTypes.func,
	onPaymentSheetOpen: PropTypes.func,
	onPaymentSheetClose: PropTypes.func,
	onPayButtonHover: PropTypes.func,
	onPayButtonClick: PropTypes.func,
	buttonProps: PropTypes.object,
	util: PropTypes.object
};

export const PayButtonDefaultProps = {
	items: [],
	checkout: {},
	actions: {},
	paymentOptionName: "",
	onAuthorisedPayment: () => {},
	onPaymentFailure: () => {},
	onPaymentSheetOpen: () => {},
	onPaymentSheetClose: () => {},
	onPayButtonHover: () => {},
	onPayButtonClick: () => {},
	buttonProps: {},
	util: {}
};

export default PayButton;
