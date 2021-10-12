import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { X } from "react-feather";

const Button = styled.button`
	position: absolute;
	right: 5px;
	top: 10px;
	height: 50px;
	width: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0);
	color: rgb(120, 120, 120);
	z-index: 100;
	border: none;
	outline: 0;
	transition: background-color 0.25s, color 0.25s;

	&:hover {
		background-color: rgba(100, 100, 100, 0.1);
		color: rgb(100, 100, 100);
		cursor: pointer;
	}
	&:active {
		background-color: rgba(100, 100, 100, 0.15);
	}
	& > svg {
		stroke-width: 3px;
	}
`;

const Close = ({ onClick }) => {
	return (
		<Button onClick={onClick}>
			<X size={20} />
		</Button>
	);
};

Close.propTypes = {
	onClick: PropTypes.func.isRequired
};

export default Close;
