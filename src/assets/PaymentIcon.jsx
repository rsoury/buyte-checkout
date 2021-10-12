import React from "react";
import PropTypes from "prop-types";
import _startCase from "lodash.startcase";
import toReactComponent from "svgr.macro";

const MastercardIcon = toReactComponent("./payment-icons/mastercard.svg");
const VisaIcon = toReactComponent("./payment-icons/visa.svg");
const AmexIcon = toReactComponent("./payment-icons/amex.svg");
const DiscoverIcon = toReactComponent("./payment-icons/discover.svg");
const InteracIcon = toReactComponent("./payment-icons/interac.svg");
const JcbIcon = toReactComponent("./payment-icons/jcb.svg");

const PaymentIcon = ({ type, ...props }) => {
	const typeKey = type.toUpperCase();
	const formatted = _startCase(type.toLowerCase());
	switch (typeKey) {
		case "MASTERCARD": {
			return <MastercardIcon {...props} />;
		}
		case "VISA": {
			return <VisaIcon {...props} />;
		}
		case "AMEX": {
			return <AmexIcon {...props} width={48} height={30} />;
		}
		case "DISCOVER": {
			return <DiscoverIcon {...props} width={48} />;
		}
		case "INTERAC": {
			return <InteracIcon {...props} />;
		}
		case "JCB": {
			return <JcbIcon {...props} />;
		}
		default: {
			return <span>{formatted}&nbsp;</span>;
		}
	}
};

PaymentIcon.propTypes = {
	type: PropTypes.string.isRequired,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

PaymentIcon.defaultProps = {
	width: 30,
	height: 25
};

export default PaymentIcon;
