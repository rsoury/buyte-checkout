/* eslint-disable no-console */

import isProd from "@/utils/is-prod";
import validItemTypes from "@/constants/valid-item-types";

const prefix = `Buyte Error: `;

const errors = {
	noMount: `No where to mount Widget. Please implement element <div id="buyte-checkout-widget"></div>`,
	cannotLoadCheckout: "Cannot load checkout",
	noStore: "Widget has not been loaded.",
	itemLessThanFifty: "Cannot add item with amount less than 50.",
	itemTypeInvalid:
		"Cannot add item with invalid type. Valid item types include: ",
	itemNameRequired: "Cannot add item with invalid name.",
	shippingMethodIdRequired: "Shipping method invalid. Id property required.",
	shippingMethodNameRequired: "Shipping method invalid. Name property required."
};

Object.keys(errors).forEach(key => {
	errors[key] = prefix + errors[key];
});

export const noMountError = () => {
	throw new Error(errors.noMount);
};

export const cannotLoadCheckoutError = e =>
	console.error(errors.cannotLoadCheckout, isProd ? e : null);

export const noStoreError = () => {
	throw new Error(errors.noStore);
};

export const itemLessThanFiftyError = item =>
	console.error(errors.itemLessThanFifty, item);
export const itemTypeInvalidError = item =>
	console.error(errors.itemTypeInvalid + validItemTypes.join(", "), item);
export const itemNameRequiredError = item =>
	console.error(errors.itemNameRequired, item);

export const shippingMethodIdRequiredError = shippingMethod =>
	console.error(errors.shippingMethodIdRequired, shippingMethod);
export const shippingMethodNameRequiredError = shippingMethod =>
	console.error(errors.shippingMethodNameRequired, shippingMethod);
