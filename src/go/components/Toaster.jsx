import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { ToastProvider } from "react-toast-notifications";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "react-feather";
import { TransitionGroup } from "react-transition-group";

import * as colors from "@/constants/colors";

const ToastWrapper = styled.div`
	border: none;
	font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont,
		"Helvetica Neue", "Helvetica", "Arial", sans-serif;
	border-bottom: 3px solid ${props => props.color || colors.SECONDARY};
	background-color: #fff;
	box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
		0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
	padding: 20px;
	border-radius: 4px;
	box-sizing: border-box;
	margin: 10px;
	max-width: 350px;
	line-height: 20px;
	font-size: 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 99999999;
	position: relative;
	opacity: ${props => (props.isShown ? 1 : 0)};
	transform: ${props => (props.isShown ? "translateY(0)" : "translateY(5px)")};
	transition: opacity 0.25s, transform 0.25s;
`;
const ToastMessage = styled.div`
	flex: 1;
`;
const ToastIconWrapper = styled.div`
	margin-right: 15px;
	color: ${props => props.color || colors.BLACK};
	border-radius: 100px;
	background-color: ${props => props.backgroundColor || "transparent"};
	height: 40px;
	width: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	& svg {
		stroke-weight: 3px;
	}
`;
const BaseToastContainer = styled.div`
	z-index: 99999999;
	box-sizing: border-box;
	max-height: 100%;
	padding: 8px;
	pointer-events: ${props => (props.hasChildren ? "auto" : "none")};
	position: fixed;
	top: 0;
	right: 0;
`;
const ToastContainer = ({ children, ...props }) => (
	<BaseToastContainer hasChildren={!!React.Children.count(children)} {...props}>
		<TransitionGroup component={null}>{children}</TransitionGroup>
	</BaseToastContainer>
);

ToastContainer.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};
ToastContainer.defaultProps = {
	children: undefined
};

const Toast = ({ children, ...props }) => {
	let color = colors.INFO;
	let backgroundColor = colors.INFO_LIGHT;
	let ToastIcon = Info;
	switch (props.appearance) {
		case "error":
			ToastIcon = AlertCircle;
			color = colors.ERROR;
			backgroundColor = colors.ERROR_LIGHT;
			break;
		case "warning":
			ToastIcon = AlertTriangle;
			color = colors.WARNING;
			backgroundColor = colors.WARNING_LIGHT;
			break;
		case "success":
			ToastIcon = CheckCircle;
			color = colors.SUCCESS;
			backgroundColor = colors.SUCCESS_LIGHT;
			break;
		default:
			break;
	}
	const { transitionState } = props;
	return (
		<ToastWrapper
			color={color}
			backgroundColor={backgroundColor}
			isShown={transitionState === "entered"}
		>
			<ToastIconWrapper color={color} backgroundColor={backgroundColor}>
				<ToastIcon />
			</ToastIconWrapper>
			<ToastMessage>{children}</ToastMessage>
		</ToastWrapper>
	);
};

Toast.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]),
	appearance: PropTypes.string,
	transitionState: PropTypes.string
};
Toast.defaultProps = {
	children: undefined,
	appearance: "",
	transitionState: ""
};

const Toaster = ({ children, ...props }) => (
	<ToastProvider components={{ Toast, ToastContainer }} {...props}>
		{children}
	</ToastProvider>
);

Toaster.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};
Toaster.defaultProps = {
	children: undefined
};

export default Toaster;
