import isEmpty from "is-empty";

import * as itemTypes from "@/constants/valid-item-types";
import { formatAmount } from "@/utils/amount";

class ItemsHelper {
	items = [];

	constructor(items = []) {
		this.items = items;
	}

	getProducts() {
		const { items } = this;
		return items
			.filter(({ type: itemType }) => itemType === itemTypes.PRODUCT)
			.map(({ name, amount, quantity }) => ({
				name,
				amount: formatAmount(amount),
				quantity
			}));
	}

	getTotalForType(type, returnInt = false) {
		const { items } = this;
		let total = items.reduce((_accumulator, value) => {
			let accumulator = _accumulator;
			// Run for all types in a provided array of types, or run for all types if type is null, or run for specific type.
			if (
				Array.isArray(type)
					? type.includes(value.type)
					: isEmpty(type) || value.type === type
			) {
				switch (value.type) {
					case itemTypes.PRODUCT: {
						accumulator += value.amount * value.quantity;
						break;
					}
					case itemTypes.DISCOUNT:
					case itemTypes.CREDIT: {
						accumulator -= value.amount;
						break;
					}
					default: {
						accumulator += value.amount;
						break;
					}
				}
			}
			return accumulator;
		}, 0);

		if (!returnInt) {
			total = formatAmount(total);
		}

		return total;
	}
}

export default ItemsHelper;
