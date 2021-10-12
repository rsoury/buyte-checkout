import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Loader from "react-spinners/BarLoader";

const ButtonWrapper = styled.div`
	position: relative;
	display: block;
	box-sizing: border-box;
	background-size: contain;
	background-position: center;
	background-origin: content-box;
	background-repeat: no-repeat;
	width: 100%;
	height: 52.5px;
	border-radius: 4px;
	text-align: center;
	overflow: hidden;
	padding: 7.5px 7.5px 0 0;
	outline: 0 !important;
`;
const StyledButton = styled.button`
	border: none;
	height: 100%;
	width: 100%;
	margin: 0;
	box-sizing: border-box;
	color: ${props => props.color || (props.isDark ? "#000" : "#fff")};
	border-radius: 4px;
	overflow: hidden;
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;
	background-origin: content-box;
	background-color: ${props =>
		props.backgroundColor || (props.isDark ? "#fff" : "#000")};
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: nowrap;
	outline: 0 !important;
	transition: all 0.25s;
	overflow: hidden;
	position: relative;
	font-size: 18px;
	${"" /* eslint-disable no-nested-ternary */}
	&:hover {
		cursor: pointer;
		transform: ${props =>
			!props.isMobile ? "translate(5px, -5px)" : "translate(0)"};
		box-shadow: ${props =>
			!props.isMobile
				? props.isDark
					? "-5px 5px 0 rgba(255, 255, 255, 0.25)"
					: "-5px 5px 0 rgba(0, 0, 0, 0.25)"
				: "none"};
		z-index: 10;
	}
	&:active {
		transform: translate(0) !important;
		box-shadow: none !important;
		z-index: 10;
		opacity: ${props => (props.isMobile ? 0.7 : 1)};
	}
	& img {
		height: 27.5px;
		pointer-events: none;
		outline: 0 !important;
	}
`;

const Button = ({ children, ...props }) => {
	const { isLoading, isDark } = props;
	return (
		<ButtonWrapper>
			<StyledButton {...props} isMobile={window.innerWidth <= 767}>
				{isLoading ? <Loader color={isDark ? "#000" : "#fff"} /> : children}
			</StyledButton>
		</ButtonWrapper>
	);
};

Button.propTypes = {
	isLoading: PropTypes.bool,
	isDark: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};

Button.defaultProps = {
	isLoading: false,
	isDark: false,
	children: undefined
};

export const PayButtonWrapper = styled.div`
	transition: all 0.15s;
	max-width: 400px;
	margin: 0 auto;
	pointer-events: ${props =>
		props.isDisabled || props.isLoading ? "none" : "auto"};
	box-shadow: ${props =>
		props.isDisabled
			? "none"
			: `0 13px 27px -5px rgba(50, 50, 93, 0.25),
		0 8px 16px -8px rgba(0, 0, 0, 0.3),
		0 -6px 16px -6px rgba(0, 0, 0, 0.025)`};
	opacity: ${props => (props.isDisabled ? 0.35 : 1)};
	transition: all 0.15s;
	& > div {
		height: 50px;
		padding: 0 !important;
		box-shadow: none !important;
		transform: none !important;
		& button {
			box-shadow: none !important;
			transform: none !important;
		}
	}
	@media (min-width: 1025px) {
		&:hover {
			transform: translate(5px, -5px);
			box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
				0 18px 36px -18px rgba(0, 0, 0, 0.3),
				0 -12px 36px -8px rgba(0, 0, 0, 0.025);
		}
		&:active {
			transform: translate(0, 0) !important;
		}
	}
`;

export default Button;
