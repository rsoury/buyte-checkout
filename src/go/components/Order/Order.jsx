import React, { useState } from "react";
import { Package, ChevronUp, ChevronRight } from "react-feather";

import Breakdown from "@/shared-components/OrderBreakdown";
import Block from "../Block";
import Spacer from "../Spacer";
import { Container, ToggleShow } from "./styles";

const Order = ({ ...breakdownProps }) => {
	const [show, setShow] = useState(false);

	return show ? (
		<Container>
			<Block icon={<Package size={20} />} title="Order Breakdown">
				<Breakdown {...breakdownProps} compact />
			</Block>
			<Spacer />
			<ToggleShow toggled={show} onClick={() => setShow(false)}>
				<ChevronUp size={18} />
				<span>Dismiss</span>
			</ToggleShow>
		</Container>
	) : (
		<Container>
			<ToggleShow toggled={show} onClick={() => setShow(true)}>
				<ChevronRight size={18} />
				<span>Show Order Breakdown</span>
			</ToggleShow>
		</Container>
	);
};

export default Order;
