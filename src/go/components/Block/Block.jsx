import React from "react";
import PropTypes from "prop-types";

import { Container, Title, Content, Icon, TitleText } from "./styles";

const Block = ({ icon, title, children, fullHeight }) => {
	return (
		<Container fullHeight={fullHeight}>
			{title && (
				<Title>
					{icon && <Icon>{icon}</Icon>}
					<TitleText>{title}</TitleText>
				</Title>
			)}
			<Content>{children}</Content>
		</Container>
	);
};

Block.propTypes = {
	icon: PropTypes.node,
	title: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]),
	fullHeight: PropTypes.bool
};

Block.defaultProps = {
	icon: undefined,
	title: "",
	children: undefined,
	fullHeight: false
};

export default Block;
