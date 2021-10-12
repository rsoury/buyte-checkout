import React from "react";
import PropTypes from "prop-types";
import { ChevronLeft } from "react-feather";

import { Container, Heading, BackLink } from "./styles";

const Header = ({ close }) => {
	return (
		<Container>
			<BackLink onClick={close}>
				<ChevronLeft size={20} />
				<span>Back</span>
			</BackLink>
			<Heading>Authorise Payment</Heading>
		</Container>
	);
};

Header.propTypes = {
	close: PropTypes.func
};

Header.defaultProps = {
	close: () => {}
};

export default Header;
