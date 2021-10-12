import styled from "styled-components";
import "normalize.css";

export const Page = styled.div`
	position: relative;
	font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont,
		"Helvetica Neue", "Helvetica", "Arial", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: ${props => props.theme.colors.BLACK};
	margin: 0 auto;
	max-width: 100%;
	@media (min-width: 1025px) and (min-height: ${props =>
			`${props.minimumHeightForElevation}px`}) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
`;

export const Main = styled.div`
	position: relative;
	max-width: 550px;
	width: 100%;
	margin: 0 auto;
	padding: 0 10px;
	border-radius: 8px;
`;

export const Body = styled.div`
	position: relative;
	padding: 20px 0;
`;

export const Signature = styled.a`
	padding: 25px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	opacity: 0.35;
	transition: opacity 0.25s;
	text-decoration: none;
	color: ${props => props.theme.colors.BLACK};
	& > span {
		font-size: 14px;
		margin-right: 10px;
	}
	& > img {
		width: 75px;
	}
	&:hover {
		opacity: 0.75;
		cursor: pointer;
	}
`;
