import styled from "styled-components";

export const Container = styled.div`
	position: relative;
`;

export const ToggleShow = styled.button`
	padding: 10px;
	border: none;
	border-radius: 4px;
	width: 100%;
	outline: 0;
	display: flex;
	background-color: transparent;
	align-items: center;
	justify-content: flex-start;
	font-weight: 600;
	transition: background-color 0.25s;

	& svg {
		margin: 0 10px;
		stroke-width: 3px;
		color: ${props => props.theme.colors.BLACK};
	}

	&:hover {
		cursor: pointer;
		background-color: rgb(245, 245, 245);
	}
	&:active {
		background-color: rgb(230, 230, 230);
	}
`;
