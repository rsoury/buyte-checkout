import React, { useState } from "react";
import styled from "styled-components";
import { ChevronUp, ChevronDown } from "react-feather";

import Breakdown from "@/shared-components/OrderBreakdown";
import * as colors from "@/constants/colors";

const Container = styled.div`
	background-color: ${() => colors.BLUE_GREY};
	padding: 50px 20px 20px;
`;
const ToggleShow = styled.button`
	background-color: transparent;
	border: none;
	outline: 0;
	transition: opacity 0.15s;
	${props => props.theme.text.heavy};
	color: rgba(100, 100, 100, 0.5);
	display: flex;
	align-items: center;
	width: 100%;

	& svg {
		margin-right: 5px;
	}

	&:active {
		opacity: 0.5;
	}
`;

const Order = ({ ...breakdownProps }) => {
	const isTabletOrSmaller = window.innerWidth < 768;
	const [show, setShow] = useState(!isTabletOrSmaller);

	return (
		<Container>
			{(show || !isTabletOrSmaller) && (
				<Breakdown compact {...breakdownProps} />
			)}
			{isTabletOrSmaller && (
				<ToggleShow onClick={() => setShow(!show)}>
					{show ? <ChevronUp /> : <ChevronDown />}
					{show ? "Hide Order" : "Show Order"}
				</ToggleShow>
			)}
		</Container>
	);
};

Order.propTypes = {
	...Breakdown.propTypes
};

Order.defaultProps = {
	...Breakdown.defaultProps
};

export default Order;
