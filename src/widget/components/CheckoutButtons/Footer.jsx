import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _get from "lodash.get";
import styled from "styled-components";

import * as colors from "@/constants/colors";

const Footer = styled.div`
	position: relative;
	& a {
		color: ${({ isDark }) => (isDark ? "#fff" : colors.BLACK)};
		width: 100%;
		text-align: left;
		font-size: 11px;
		padding: 5px 5px 5px 30px;
		font-weight: 900;
		letter-spacing: 1px;
		text-transform: uppercase;
		transition: padding 0.25s;
		text-decoration: none;
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		&:before {
			content: "";
			position: absolute;
			left: 0;
			width: 20px;
			height: 3px;
			background-color: ${({ isDark }) => (isDark ? "#fff" : colors.BLACK)};
			top: 11px;
			transition: width 0.25s;
		}
		&:hover {
			padding-left: 35px;
			&:before {
				width: 25px;
			}
		}
		& > span {
			text-decoration: underline;
		}
	}
`;

const CheckoutButtonsFooter = ({ isDark, onClick }) => (
	<Footer isDark={isDark}>
		<div>
			<a
				href="https://buyte.dev/?utm_source=powered-by&utm_medium=widget&utm_campaign=buyte"
				target="_blank"
				rel="noopener noreferrer"
				title="Digital Wallet Checkouts powered by Buyte"
				onClick={onClick}
			>
				Wallet checkouts by <span>Buyte</span>
			</a>
		</div>
	</Footer>
);

CheckoutButtonsFooter.propTypes = {
	isDark: PropTypes.bool,
	onClick: PropTypes.func
};

CheckoutButtonsFooter.defaultProps = {
	isDark: false,
	onClick: () => {}
};

function mapStateToProps({ settings = {} }) {
	return {
		isDark: !!_get(settings, "options.dark", false)
	};
}
export default connect(mapStateToProps)(CheckoutButtonsFooter);
