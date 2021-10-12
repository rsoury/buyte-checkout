import styled from "styled-components";

import * as colors from "@/constants/colors";

export const Container = styled.div`
	background-color: #fff;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	@media (max-width: 479px) {
		padding-bottom: 60px;
	}
`;
export const Bottom = styled.div`
	padding-top: 20px;
`;
export const Title = styled.strong`
	display: block;
	font-size: 22px;
	font-weight: 700;
	padding-bottom: 30px;
`;
export const SectionTitle = styled.div`
	position: relative;
	${props => props.theme.text.heavy};
	display: flex;
	align-items: center;
	& > svg {
		margin-right: 7.5px;
		stroke-width: 3px;
	}
	& > div {
		color: ${() => colors.SECONDARY};
	}
`;
export const SectionContent = styled.div`
	position: relative;
	font-size: 16px;
	line-height: 21px;
	padding: 10px 15px;
	border-radius: 4px;
	border: 1px solid rgb(240, 240, 240);
	& p {
		margin-top: 0;
		margin-bottom: 5px;
	}
`;
export const Section = styled.div`
	position: relative;
	margin-bottom: 20px;

	${SectionTitle} {
		margin-bottom: 10px;
	}
`;
export const Payment = styled.div`
	position: relative;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	flex-direction: row;

	& svg {
		margin-right: 10px;
		padding: 2.5px 5px;
		border: 1px solid rgb(240, 240, 240);
		border-radius: 4px;
		box-sizing: content-box;
	}
`;
export const PaymentCompact = styled.div`
	display: flex;
	align-items: center;
	& svg {
		margin-right: 10px;
	}
`;
export const SpaceBetween = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
export const LoaderWrapper = styled.div`
	padding: 20px 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;
export const CompactSection = styled(Section)`
	${SpaceBetween} {
		&:nth-child(1) {
			margin-bottom: 10px;
		}
	}
	${SectionTitle} {
		margin: 0;
	}
	${SectionContent} {
		font-size: 14px;
		font-weight: 600;
	}
`;
export const SectionContentButton = styled.button`
	position: absolute;
	right: 0;
	top: 0;
	background-color: transparent;
	border: none;
	color: ${() => colors.INFO};
	padding: 5px 10px;
	font-weight: 600;
	text-decoration: underline;
	z-index: 1000;
	width: 100%;
	height: 100%;
	margin: 0;
	outline: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-end;
	transition: background-color 0.25s;

	@media (min-width: 480px) {
		&:hover {
			cursor: pointer;
			background-color: rgba(200, 200, 200, 0.1);
		}
	}
`;
export const ToggleCompact = styled.button`
	padding: 5px;
	border: none;
	border-radius: 4px;
	width: 100%;
	outline: 0;
	background-color: ${props =>
		props.compact ? "transparent" : "rgb(240, 240, 240)"};
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	transition: background-color 0.25s;

	& svg {
		margin-right: ${props => (props.iconLeft ? "5px" : "0")};
		stroke-width: 3px;
		color: ${() => colors.BLACK};
	}

	&:hover {
		cursor: pointer;
		background-color: rgb(245, 245, 245);
	}
	&:active {
		background-color: rgb(230, 230, 230);
	}
`;

export const PaymentType = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
`;
