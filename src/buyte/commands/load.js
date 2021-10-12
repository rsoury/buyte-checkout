import isEmpty from "is-empty";
import clone from "clone";
import RenderWidget from "@/widget";
import Store from "@/buyte/store";
import { add as addItem } from "./item";

/* eslint-disable no-console */
const load = async (providedSettings = {}) => {
	// Convert from Proxy object to object to be used.
	// Prevents random mutable data modifications -- compatible with Redux store.
	const settings = clone(providedSettings);

	// Use settings to request full checkout from API
	// Load the widget...
	if (isEmpty(settings.publicKey)) {
		console.error("Public Key must be provided.");
	}
	if (isEmpty(settings.widgetId)) {
		console.error("Widget Id must be provided.");
	}

	// Setup store
	const store = await RenderWidget({ settings });
	Store.set(store);

	// Add items to store using item methods.
	const { items = [] } = settings;
	items.forEach(item => {
		addItem(item);
	});
};

export default load;
