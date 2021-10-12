import React from "react";
import PropTypes from "prop-types";
import _startCase from "lodash.startcase";

import * as buttonTypes from "@/constants/button-types";
import { ApplePayLogo, GooglePayLogo } from "./ButtonLogos";

const PaymentTypeIcon = ({ type, ...props }) => {
	const typeKey = type.toUpperCase();
	const formatted = _startCase(type.toLowerCase());
	switch (typeKey) {
		case buttonTypes.APPLE_PAY: {
			return <ApplePayLogo {...props} />;
		}
		case buttonTypes.GOOGLE_PAY: {
			return <GooglePayLogo {...props} />;
		}
		default: {
			return <span>{formatted}</span>;
		}
	}
};

PaymentTypeIcon.propTypes = {
	type: PropTypes.string.isRequired
};

export default PaymentTypeIcon;
