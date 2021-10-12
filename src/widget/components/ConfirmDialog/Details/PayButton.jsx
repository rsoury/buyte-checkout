import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import OriginalButton, {
	PayButtonWrapper as Wrapper
} from "@/shared-components/Button";
import * as colors from "@/constants/colors";

const Container = styled.div`
	position: relative;
	@media (max-width: 479px) {
		padding-bottom: 100px;
	}
`;
const Button = styled(OriginalButton)`
	background-color: ${() => colors.SECONDARY_ALT} !important;
	&:hover {
		background-color: ${() => colors.SECONDARY} !important;
	}
	&:active {
		background-color: ${() => colors.SECONDARY_DARK} !important;
	}
`;
const Contents = styled.div`
	font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont,
		"Helvetica Neue", "Helvetica", "Arial", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-weight: 900;
`;

const PayButton = ({ isDisabled, totalAmount, buttonProps, onClick }) => {
	return (
		<Container>
			<Wrapper isDisabled={isDisabled}>
				<Button onClick={onClick} {...buttonProps}>
					<Contents>Pay ${totalAmount} Now</Contents>
				</Button>
			</Wrapper>
		</Container>
	);
};

/* eslint-disable react/forbid-prop-types */
PayButton.propTypes = {
	isDisabled: PropTypes.bool,
	totalAmount: PropTypes.string,
	buttonProps: PropTypes.object,
	onClick: PropTypes.func
};

PayButton.defaultProps = {
	isDisabled: false,
	totalAmount: "...",
	buttonProps: {},
	onClick: () => {}
};

export default PayButton;
