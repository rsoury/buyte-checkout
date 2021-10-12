import React, { Component } from "react";
import PropTypes from "prop-types";

class PassThroughProps extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]).isRequired
	};

	renderChildren = () => {
		const { children, ...props } = this.props;
		// 👇 The <Parent /> renders it's children, but passes in this.props.gutter as the gutter to each child
		return React.Children.map(children, child =>
			React.cloneElement(child, {
				...props
			})
		);
	};

	render() {
		return this.renderChildren();
	}
}

export default PassThroughProps;
