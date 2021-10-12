import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Package } from "react-feather";
import Loader from "react-spinners/BarLoader";
import isEmpty from "is-empty";

import { formatAmount } from "@/utils/amount";
import { ShippingMethodsProps } from "@/constants/common-prop-types";
import {
	Section,
	SectionTitle,
	SectionContent,
	SpaceBetween,
	LoaderWrapper,
	SectionContentButton
} from "./styles";

const ShippingMethod = styled.div`
	position: relative;
	padding: 10px;
	background-color: #fff;
	border-radius: 4px;
	margin-bottom: 10px;
	border: 3px solid ${props => (props.selected ? "rgb(230, 230, 230)" : "#fff")};
	line-height: 21px;
	transition: background-color 0.25s, border-color 0.25s;

	@media (min-width: 480px) {
		&:hover {
			cursor: pointer;
			background-color: rgb(250, 250, 250);
			border-color: rgb(230, 230, 230);
		}
	}
	&:active {
		background-color: rgb(240, 240, 240);
	}

	&:last-child {
		margin-bottom: 0 !important;
	}

	${SpaceBetween} {
		align-items: flex-end;
	}
`;
const Label = styled.div`
	font-weight: 600;
`;
const Description = styled.div`
	font-size: 14px;
`;
const Rate = styled.div``;
const ShippingSection = styled(Section)`
	position: relative;
`;
const Selected = styled.div`
	padding-top: ${props => (props.noDescription ? "15px" : "0")};
	${ShippingMethod} {
		margin: 0;
		padding: 0;
		border: 0;
	}
`;

const SelectShippingMethod = ({ shippingMethods, onSelect, selectedId }) => {
	const [change, setChange] = useState(false);

	// Make sure there is something in the selected Id before using it
	const isLoading = isEmpty(shippingMethods) || isEmpty(selectedId);
	const selectedMethod =
		shippingMethods.find(({ id }) => id === selectedId) || shippingMethods[0];

	return (
		<ShippingSection>
			<SectionTitle>
				<Package size={20} />
				<div>Select a shipping method</div>
			</SectionTitle>
			<SectionContent>
				{isLoading && (
					<LoaderWrapper>
						<Loader color="#111" />
					</LoaderWrapper>
				)}
				{!isLoading &&
					(change ? (
						<div>
							{shippingMethods.map(({ id, label, description, rate }) => (
								<ShippingMethod
									key={id}
									onClick={() => {
										onSelect(id);
										setChange(false);
									}}
									selected={id === selectedId}
								>
									<SpaceBetween>
										<div>
											<Label>
												<strong>{label}</strong>
											</Label>
											{description && <Description>{description}</Description>}
										</div>
										<Rate>${formatAmount(rate)}</Rate>
									</SpaceBetween>
								</ShippingMethod>
							))}
						</div>
					) : (
						<>
							<Selected noDescription={!selectedMethod.description}>
								<ShippingMethod>
									<SpaceBetween>
										<div>
											<Label>
												<strong>{selectedMethod.label}</strong>
											</Label>
											{selectedMethod.description && (
												<Description>{selectedMethod.description}</Description>
											)}
										</div>
										<Rate>${formatAmount(selectedMethod.rate)}</Rate>
									</SpaceBetween>
								</ShippingMethod>
							</Selected>
							<SectionContentButton onClick={() => setChange(true)}>
								Change
							</SectionContentButton>
						</>
					))}
			</SectionContent>
		</ShippingSection>
	);
};

SelectShippingMethod.propTypes = {
	shippingMethods: ShippingMethodsProps,
	onSelect: PropTypes.func,
	selectedId: PropTypes.string
};

SelectShippingMethod.defaultProps = {
	shippingMethods: [],
	selectedId: "",
	onSelect: () => {}
};

export default SelectShippingMethod;
