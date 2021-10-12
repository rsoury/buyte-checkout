import React, { Component } from "react";
import { connect } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import { componentWillAppendToBody } from "react-append-to-body";
import Helmet from "react-helmet";
import _get from "lodash.get";

import { loadCheckout as loadCheckoutAction } from "@/actions";
import { isSupported } from "@/utils/browser-traits";
import { goUrl } from "@/utils/env-config";
import CheckoutButtons from "./CheckoutButtons";
import StyledFrame from "./StyledFrame";
import ConfirmDialog from "./ConfirmDialog";

const BUTTON_HEIGHT = 60;
const BASE_HEIGHT = 15;

const AppendedConfirmDialog = componentWillAppendToBody(ConfirmDialog);

const GlobalStyle = createGlobalStyle`
	body, html {
		margin: 0;
		padding: 0;
	}
`;

const Container = styled.div`
	position: relative;
	font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Helvetica",
		"Arial", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
`;
const Frame = styled(StyledFrame)`
	overflow: hidden !important;
	width: 275px;
	@media screen and (max-width: 450px) {
		width: 100vw;
		max-width: 100%;
	}
`;

class App extends Component {
	static propTypes = {
		loadCheckout: PropTypes.func,
		isDestroyed: PropTypes.bool,
		show: PropTypes.bool,
		numberOfShowingButtons: PropTypes.number,
		customCss: PropTypes.string
	};

	static defaultProps = {
		loadCheckout: () => {},
		isDestroyed: false,
		show: true,
		numberOfShowingButtons: 0,
		customCss: ""
	};

	componentDidMount() {
		if (isSupported) {
			// Load checkout
			const { loadCheckout } = this.props;
			loadCheckout();
		}
	}

	render() {
		const { isDestroyed, show, numberOfShowingButtons, customCss } = this.props;

		return !isDestroyed && !!isSupported ? (
			<>
				<Helmet>
					<link rel="prerender" href={goUrl} />
					{customCss && <link rel="stylesheet" href={customCss} />}
				</Helmet>
				<AppendedConfirmDialog />
				<Frame
					style={{
						height: `${numberOfShowingButtons * BUTTON_HEIGHT + BASE_HEIGHT}px`
					}}
					scrolling="no"
				>
					<>
						<GlobalStyle />
						<Container
							id="buyte-container"
							style={
								show
									? {}
									: {
											opacity: 0,
											visibility: "hidden",
											pointerEvents: "none",
											height: 0,
											width: 0
									  }
							}
						>
							<CheckoutButtons />
						</Container>
					</>
				</Frame>
			</>
		) : null;
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadCheckout() {
			dispatch(loadCheckoutAction());
		}
	};
}
function mapStateToProps({
	isDestroyed,
	show,
	showingButtons = [],
	isEnabled,
	checkout
}) {
	return {
		isDestroyed,
		show,
		numberOfShowingButtons:
			showingButtons.length === 0 ? 1 : showingButtons.length,
		isEnabled,
		customCss: _get(checkout, "customCss")
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
