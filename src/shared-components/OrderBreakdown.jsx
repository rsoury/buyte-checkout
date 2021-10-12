import React from "react";
import styled, { ThemeProvider } from "styled-components";
import isEmpty from "is-empty";
import PropTypes from "prop-types";

import * as colors from "@/constants/colors";

const Breakdown = styled.div`
	margin: 20px 0;
`;
const Seperator = styled.div`
	border-bottom: ${props =>
		!props.theme.isCompact
			? `3px solid ${colors.BLACK}`
			: "1px solid rgba(80, 80, 80, 0.1)"};
	margin: 10px 0;
`;
const Item = styled.div`
	padding: ${props => (props.theme.isCompact ? "0" : "10px")};
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: ${props => (props.theme.isCompact ? "wrap" : "inherit")};
	font-size: ${props => (props.theme.isCompact ? "14px" : "16px")};
	& > div {
		padding-right: ${props => (props.theme.isCompact ? "0" : "5px")};
		&:last-child {
			text-align: right;
		}
		${props =>
			props.theme.isCompact
				? `
					&:nth-child(1) {
						flex: 1 0 100%;
						margin-bottom: 5px;
					}
					&:nth-child(2),
					&:nth-child(3) {
						flex: 1 0 50%;
					}
				`
				: `
					&:nth-child(1) {
						flex: 1 0 50%;
					}
					&:nth-child(2),
					&:nth-child(3) {
						flex: 1 0 25%;
					}
				`}
	}
`;
const Items = styled.div`
	border-left: none;
	border-right: none;
	${Item} {
		font-weight: 400;
		line-height: 21px;
		margin: ${props =>
			props.theme.isCompact ? "0 -10px 10px -20px" : "0 0 10px 0"};
		border-left: ${props =>
			props.theme.isCompact ? `3px solid rgba(80, 80, 80, 0.9)` : "none"};
		background-color: ${props =>
			props.theme.isCompact ? `rgba(200, 200, 200, 0.1)` : "transparent"};
		padding: ${props => (props.theme.isCompact ? "5px 10px 5px 20px" : "10px")};
		border-radius: ${props => (props.theme.isCompact ? `0 4px 4px 0` : "0")};
	}
`;
const Totals = styled.div`
	width: 100%;
	margin: 0 0 0 auto;
	padding: ${props => (props.theme.isCompact ? "0" : "10px 0")};
	max-width: ${props => (props.theme.isCompact ? "none" : "231px")};

	${Item} {
		& > div {
			flex: 1 0 50% !important;
			&:nth-child(1) {
				opacity: 0.75;
			}
			&:nth-child(2) {
				font-weight: 700;
			}
		}
	}
`;
const FinalTotals = styled(Totals)`
	border: none !important;
	& > ${Item} {
		& > div {
			opacity: 1 !important;
			font-weight: 700;
			font-size: ${props => (props.theme.isCompact ? "16px" : "18px")};
		}
	}
`;

const ItemsHeading = styled.div`
	${Item} {
		${props => props.theme.text.heavy};
		color: rgb(200, 200, 200);
		line-height: inherit;
		@media screen and (max-width: 450px) {
			font-size: 10px !important;
		}
	}
`;

const OrderBreakdown = ({
	totalAmount,
	products,
	productTotal,
	shippingTotal,
	taxTotal,
	discountTotal,
	creditTotal,
	enableShipping,
	compact
}) => (
	<ThemeProvider
		theme={{
			isCompact: compact
		}}
	>
		<Breakdown>
			{!compact && (
				<ItemsHeading>
					<Item>
						<div>
							<strong>Item</strong>
						</div>
						<div>
							<strong>Quantity</strong>
						</div>
						<div>
							<strong>Price</strong>
						</div>
					</Item>
				</ItemsHeading>
			)}
			<Items>
				{products.map(({ name, amount, quantity }) => (
					<Item key={`${name}-${amount}-${quantity}`}>
						<div>{name}</div>
						<div>{quantity}</div>
						<div>${amount}</div>
					</Item>
				))}
			</Items>
			<Seperator />
			<Totals>
				<Item>
					<div>Subtotal:</div>
					<div>${productTotal}</div>
				</Item>
				{enableShipping && (
					<Item>
						<div>Shipping:</div>
						{!isEmpty(parseFloat(shippingTotal)) ? (
							<div>${shippingTotal}</div>
						) : (
							<div>Free</div>
						)}
					</Item>
				)}
				{!isEmpty(parseFloat(taxTotal)) && (
					<Item>
						<div>Tax:</div>
						<div>${taxTotal}</div>
					</Item>
				)}
				{!isEmpty(parseFloat(discountTotal)) && (
					<Item>
						<div>Discounts:</div>
						<div>- ${discountTotal}</div>
					</Item>
				)}
				{!isEmpty(parseFloat(creditTotal)) && (
					<Item>
						<div>Store Credit:</div>
						<div>- ${creditTotal}</div>
					</Item>
				)}
			</Totals>
			<Seperator />
			<FinalTotals>
				<Item>
					<div>Total:</div>
					<div>${totalAmount}</div>
				</Item>
			</FinalTotals>
		</Breakdown>
	</ThemeProvider>
);

OrderBreakdown.propTypes = {
	totalAmount: PropTypes.string,
	products: PropTypes.arrayOf(PropTypes.object),
	productTotal: PropTypes.string,
	shippingTotal: PropTypes.string,
	taxTotal: PropTypes.string,
	discountTotal: PropTypes.string,
	creditTotal: PropTypes.string,
	enableShipping: PropTypes.bool,
	compact: PropTypes.bool
};

OrderBreakdown.defaultProps = {
	totalAmount: "0.00",
	products: [],
	productTotal: "0.00",
	shippingTotal: "0.00",
	taxTotal: "0.00",
	discountTotal: "0.00",
	creditTotal: "0.00",
	enableShipping: false,
	compact: false
};

export default OrderBreakdown;
