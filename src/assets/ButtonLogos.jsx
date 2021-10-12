import React from "react";
import PropTypes from "prop-types";
import toReactComponent from "svgr.macro";

const SVGApplePayBlack = toReactComponent("./apple-pay.svg");
const SVGApplePayWhite = toReactComponent("./apple-pay-white.svg");
const SVGGooglePayBlack = toReactComponent("./google-pay.svg");
const SVGGooglePayWhite = toReactComponent("./google-pay-white.svg");

const LogoProps = {
	isDark: PropTypes.bool,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
const LogoDefaults = {
	isDark: false,
	width: 65,
	height: 30
};

export const ApplePayLogo = ({ isDark, ...props }) =>
	isDark ? <SVGApplePayBlack {...props} /> : <SVGApplePayWhite {...props} />;

ApplePayLogo.propTypes = LogoProps;
ApplePayLogo.defaultProps = LogoDefaults;

export const GooglePayLogo = ({ isDark, ...props }) =>
	isDark ? <SVGGooglePayBlack {...props} /> : <SVGGooglePayWhite {...props} />;

GooglePayLogo.propTypes = LogoProps;
GooglePayLogo.defaultProps = LogoDefaults;
