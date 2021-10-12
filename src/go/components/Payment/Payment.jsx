import React from "react";
import PropTypes from "prop-types";
import { Lock } from "react-feather";

import { Container } from "./styles";
import Block from "../Block";
import Spacer from "../Spacer";

const Payment = ({ children }) => {
	return (
		<Container>
			<Block icon={<Lock size={20} />} title="Tap to Continue">
				<Spacer />
				{children}
			</Block>
		</Container>
	);
};

Payment.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

Payment.defaultProps = {};

export default Payment;
