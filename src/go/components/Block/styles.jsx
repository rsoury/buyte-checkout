import styled from "styled-components";

export const Container = styled.div`
	background-color: #fff;
	position: relative;
	padding: 15px 20px 25px;
	border-radius: 8px;
	border: 1px solid rgb(230, 230, 230);
	height: ${props => (props.fullHeight ? "100%" : "auto")};
	@media (max-width: ${props => props.theme.breakpoints.mobile}) {
		padding: 15px 15px 20px !important;
	}
`;

export const Icon = styled.div`
	display: flex;
	margin-right: 7.5px;
	& > svg {
		stroke-width: 3px;
	}
`;

export const TitleText = styled.div`
	${props => props.theme.text.heavy};
	display: block;
	color: ${props => props.theme.colors.SECONDARY};
`;

export const Title = styled.div`
	text-align: left;
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
`;

export const Content = styled.div`
	position: relative;
`;
