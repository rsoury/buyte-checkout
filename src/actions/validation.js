import isEmpty from "is-empty";
import uuid from "uuid/v3";
import validItemTypes, { PRODUCT } from "@/constants/valid-item-types";
import * as errors from "@/errors";

const ITEM_NAMESPACE = "9a6a1614-730e-11e9-a923-1681be663d3e";
const newId = s => uuid(s, ITEM_NAMESPACE);

export const addItem = (item, includeId = true) => {
	let { name, quantity, type } = item;
	const { label, amount } = item;
	if (isEmpty(name) && !isEmpty(label)) {
		name = label;
	}
	if (isEmpty(type)) {
		type = PRODUCT;
	}
	if (isEmpty(quantity) || type !== PRODUCT) {
		quantity = 1;
	}
	if (isEmpty(name)) {
		return errors.itemNameRequiredError(item);
	}
	if (amount < 50) {
		return errors.itemLessThanFiftyError(item);
	}
	if (!validItemTypes.includes(type)) {
		return errors.itemTypeInvalidError(item);
	}
	const newItem = {
		name,
		amount,
		quantity,
		formatted: ((amount * quantity) / 100).toFixed(2),
		type
	};
	if (includeId) {
		newItem.id = newId(name);
	}
	return newItem;
};

export const removeItem = item => {
	let { id, name } = item;
	const { label } = item;
	if (isEmpty(name) && !isEmpty(label)) {
		name = label;
	}
	if (isEmpty(id) && !isEmpty(name)) {
		id = newId(name);
	}
	if (!isEmpty(id)) {
		return {
			id
		};
	}

	return {};
};

export const shippingMethods = (methods = []) => {
	// Filter methods by whether or not they're valid.
	// Throw console error if invalid.
	const filteredMethods = methods.filter(shippingMethod => {
		const { id, name, label } = shippingMethod;
		if (isEmpty(id)) {
			errors.shippingMethodIdRequiredError(shippingMethod);
			return false;
		}
		const methodLabel = label || name;
		if (isEmpty(methodLabel)) {
			errors.shippingMethodNameRequiredError(shippingMethod);
			return false;
		}
		return true;
	});

	// Ensure specific properties with defaults.
	const validMethods = filteredMethods.map(
		({
			id,
			name,
			label,
			description = "",
			rate = 0,
			minOrder = 0,
			maxOrder = null
		}) => ({
			id,
			label: label || name,
			description,
			rate,
			minOrder,
			maxOrder
		})
	);

	// Sort shipping methods from lowest to highest cost
	validMethods.sort((a, b) => {
		if (a.rate < b.rate) {
			return -1;
		}
		if (a.rate > b.rate) {
			return 1;
		}
		return 0;
	});

	if (!isEmpty(validMethods)) {
		return validMethods;
	}
	return null;
};
