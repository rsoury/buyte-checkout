import styled from "styled-components";

export const Container = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px 0;
`;

export const Heading = styled.h1`
	position: relative;
	margin: 0;
	font-size: 22px;
	text-align: right;
`;

export const BackLink = styled.button`
	padding: 0 !important;
	margin-top: -2.5px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	background-color: rgba(0, 0, 0, 0);
	border: none;
	color: ${props => props.theme.colors.SECONDARY};
	${props => props.theme.text.heavy};
	& > svg {
		stroke-width: 3px;
		transition: transform 0.25s;
	}
	& > span {
		margin-left: 5px;
	}
	&:hover {
		cursor: pointer;
		& > svg {
			transform: translateX(-5px);
		}
	}
`;
