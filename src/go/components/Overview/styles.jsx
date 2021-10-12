import styled from "styled-components";

export const StoreName = styled.div`
	position: relative;
	padding-right: 5px;
`;

export const Total = styled.div`
	position: relative;
	padding-left: 5px;
`;

export const Container = styled.div`
	position: relative;
	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-direction: row;

	${StoreName}, ${Total} {
		flex: 1 50%;
		width: 50%;
		font-size: 20px;
		font-weight: 700;
		line-height: 28px;
		@media (max-width: ${props => props.theme.breakpoints.mobile}) {
			font-size: 16px !important;
			line-height: 22px !important;
		}
	}
`;

export const Price = styled.span`
	position: relative;
	font-size: 26px;
	margin-right: 5px;
	word-break: break-all;
	@media (max-width: ${props => props.theme.breakpoints.mobile}) {
		line-height: 26px;
	}
`;

export const CurrencySymbol = styled.span`
	position: relative;
	margin-right: 5px;
`;
export const CurrencyCode = styled.span`
	position: relative;
	text-transform: uppercase;
`;
