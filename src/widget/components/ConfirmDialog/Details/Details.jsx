import React, { useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "is-empty";
import { User, CreditCard, Truck, ChevronUp } from "react-feather";

import { addressToString } from "@/utils/address";
import {
	ShippingMethodsProps,
	AddressProps
} from "@/constants/common-prop-types";
import { PaymentIcon, PaymentTypeIcon } from "@/assets";
import {
	CONFIRM_INFO_SHOW_MORE,
	CONFIRM_INFO_SHOW_LESS
} from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";

import PayButton from "./PayButton";
import SelectShippingMethod from "./SelectShippingMethod";
import {
	Container,
	Bottom,
	Title,
	SectionTitle,
	SectionContent,
	Section,
	Payment,
	PaymentCompact,
	SpaceBetween,
	CompactSection,
	SectionContentButton,
	ToggleCompact,
	PaymentType
} from "./styles";

const Details = ({
	paymentType,
	contact,
	payment,
	shippingAddress,
	billingAddress,
	enableShipping,
	shippingMethods,
	selectedShippingMethodId,
	totalAmount,
	onPay,
	onShippingMethodSelect,
	payButtonProps
}) => {
	const [compact, setCompactState] = useState(true);
	const setCompact = state => {
		track(state ? CONFIRM_INFO_SHOW_LESS : CONFIRM_INFO_SHOW_MORE);
		setCompactState(state);
	};

	const billingOutput = addressToString(billingAddress);

	return (
		<Container>
			<div>
				<div>
					<Title>Confirm order</Title>
				</div>
				{enableShipping && (
					<SelectShippingMethod
						shippingMethods={shippingMethods}
						onSelect={onShippingMethodSelect}
						selectedId={selectedShippingMethodId}
					/>
				)}
				{compact ? (
					<div>
						<CompactSection>
							<SpaceBetween>
								<SectionTitle>
									<User size={20} />
									<div>{contact.name}</div>
								</SectionTitle>
								<PaymentType>
									<PaymentTypeIcon isDark height={20} type={paymentType} />
								</PaymentType>
							</SpaceBetween>
							<SectionContent>
								<p>{contact.emailAddress}</p>
								<p>{contact.phoneNumber}</p>
								{enableShipping ? (
									<p>{addressToString(shippingAddress)}</p>
								) : (
									<p>{billingOutput}</p>
								)}
								<PaymentCompact>
									<PaymentIcon type={payment.card.network} />
									<span>{payment.card.number}</span>
								</PaymentCompact>
								<SectionContentButton onClick={() => setCompact(false)}>
									Show More
								</SectionContentButton>
							</SectionContent>
						</CompactSection>
					</div>
				) : (
					<div>
						<Section>
							<SectionTitle>
								<User size={20} />
								<div>Contact</div>
							</SectionTitle>
							<SectionContent>
								<p>{contact.name}</p>
								<p>{contact.emailAddress}</p>
								<p>{contact.phoneNumber}</p>
							</SectionContent>
						</Section>
						{enableShipping && (
							<Section>
								<SectionTitle>
									<Truck size={20} />
									<div>Ship to</div>
								</SectionTitle>
								<SectionContent>
									{shippingAddress.addressLines.map(address => (
										<p key={address}>{address}</p>
									))}
									<p>{`${shippingAddress.locality} ${shippingAddress.administrativeArea} ${shippingAddress.postalCode}`}</p>
									<p>{shippingAddress.country}</p>
								</SectionContent>
							</Section>
						)}
						<Section>
							<SectionTitle>
								<CreditCard size={20} />
								<div>Payment</div>
							</SectionTitle>
							<SectionContent>
								<Payment>
									<PaymentIcon type={payment.card.network} />
									<span>ending with {payment.card.number}</span>
								</Payment>
								{billingOutput && <sup>{billingOutput}</sup>}
							</SectionContent>
						</Section>
						<ToggleCompact
							iconLeft
							compact={compact}
							onClick={() => setCompact(true)}
						>
							<ChevronUp size={18} />
							<span>Show less</span>
						</ToggleCompact>
					</div>
				)}
			</div>
			<Bottom>
				<PayButton
					isDisabled={enableShipping && isEmpty(selectedShippingMethodId)}
					onClick={onPay}
					buttonProps={payButtonProps}
					totalAmount={totalAmount}
				/>
			</Bottom>
		</Container>
	);
};

Details.propTypes = {
	paymentType: PropTypes.string.isRequired,
	contact: PropTypes.shape({
		name: PropTypes.string,
		emailAddress: PropTypes.string,
		phoneNumber: PropTypes.string
	}).isRequired,
	shippingAddress: AddressProps,
	billingAddress: AddressProps,
	payment: PropTypes.shape({
		card: PropTypes.shape({
			network: PropTypes.string,
			number: PropTypes.string
		})
	}),
	totalAmount: PropTypes.string,
	onPay: PropTypes.func,
	payButtonProps: PropTypes.shape({
		isLoading: PropTypes.bool
	}),
	onShippingMethodSelect: PropTypes.func,
	shippingMethods: ShippingMethodsProps,
	selectedShippingMethodId: PropTypes.string,
	enableShipping: PropTypes.bool
};

Details.defaultProps = {
	shippingAddress: {},
	billingAddress: {},
	payment: {},
	totalAmount: "0.00",
	onPay: () => {},
	payButtonProps: {},
	onShippingMethodSelect: () => {},
	shippingMethods: [],
	selectedShippingMethodId: "",
	enableShipping: false
};

export default Details;
