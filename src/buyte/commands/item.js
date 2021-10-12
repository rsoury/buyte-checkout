import clone from "clone";

import Store from "@/buyte/store";
import { addItem, removeItem } from "@/actions";

// We are agnostic to whether the programmer uses the "label" or "name" property, but we prefer "name".
const itemAction = (itemToAction = {}, action) => {
	const item = clone(itemToAction);
	if (typeof item !== "object") {
		/* eslint-disable no-console */
		console.error("Item must be an object.");
		return null;
	}
	const store = Store.get();
	store.dispatch(action(item));
	return store.getState().items;
};
export const add = (item = {}) => itemAction(item, addItem);
export const remove = (item = {}) => itemAction(item, removeItem);
