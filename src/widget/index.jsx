import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import isEmpty from "is-empty";
import _get from "lodash.get";
import produce from "immer";
import { PersistGate } from "redux-persist/lib/integration/react";
import { addItem as validateItem } from "@/actions/validation";
import configureStore from "@/store/configure-store";
import initialState from "@/reducers/initial-state";
import { noMountError } from "@/errors";
import { initTracking } from "@/utils/tracking";
import App from "./components/App";

export default async (state = {}, props = {}) => {
	initTracking();

	// Able to set initial state and props.
	let rootEl;
	const mountSelector = _get(state, "settings.options.mountSelector");
	if (!isEmpty(mountSelector)) {
		rootEl = document.querySelector(mountSelector);
	}
	if (isEmpty(rootEl)) {
		rootEl = document.getElementById("buyte-checkout-widget");
	}
	// Base state is intial state, then apply all state key/values, then apply validation.
	const storeState = produce(initialState, draftState => {
		const draft = draftState;
		Object.entries(state).forEach(([key, value]) => {
			draft[key] = value;
		});
		draft.isEnabled = _get(state, "settings.options.enabled", true);
		draft.isShippingEnabled = _get(state, "settings.options.shipping", false);
		const settingsItems = _get(state, "settings.items");
		if (Array.isArray(settingsItems)) {
			if (settingsItems.length > 0) {
				// format settings items on load, and on update to prevent state mishaps.
				draft.settings.items = settingsItems
					.map(item => validateItem(item, false))
					.filter(item => typeof item === "object" && !isEmpty(item));
			}
		}
	});

	// console.log(storeState);

	const { store, persistor } = await configureStore(storeState);

	if (!isEmpty(rootEl)) {
		ReactDOM.render(
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<App {...props} />
				</PersistGate>
			</Provider>,
			rootEl
		);
	} else {
		noMountError();
	}

	return store;
};
