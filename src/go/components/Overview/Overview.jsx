import React from "react";
import PropTypes from "prop-types";
import { ShoppingCart, ShoppingBag } from "react-feather";

import {
	Container,
	StoreName,
	Total,
	Price,
	CurrencySymbol,
	CurrencyCode
} from "./styles";
import Block from "../Block";

const Overview = ({ storeName, totalAmount, currencyCode }) => {
	return (
		<Container>
			<StoreName>
				<Block icon={<ShoppingBag size={20} />} title="Checkout" fullHeight>
					{storeName}
				</Block>
			</StoreName>
			<Total>
				<Block icon={<ShoppingCart size={20} />} title="Total" fullHeight>
					<CurrencySymbol>$</CurrencySymbol>
					<Price>{totalAmount}</Price>
					{currencyCode && <CurrencyCode>{currencyCode}</CurrencyCode>}
				</Block>
			</Total>
		</Container>
	);
};

Overview.propTypes = {
	storeName: PropTypes.string.isRequired,
	totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
	currencyCode: PropTypes.string
};

Overview.defaultProps = {
	currencyCode: ""
};

export default Overview;
