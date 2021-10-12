import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "@/reducers/index";

import { isProd, reduxLogger } from "@/utils/env-config";

/* eslint-disable no-underscore-dangle */
const storeEnhancers = isProd
	? compose
	: window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default async function configureStore(initialState) {
	const middleware = [thunk];
	if (!isProd) {
		if (reduxLogger) {
			const { createLogger } = await import("redux-logger");
			middleware.push(createLogger({ collapsed: true }));
		}
		const { default: reduxImmutableStateInvariant } = await import(
			"redux-immutable-state-invariant"
		);
		middleware.push(reduxImmutableStateInvariant());
	}
	const storeEnhancements = applyMiddleware(...middleware);

	const key = `${initialState.settings.publicKey}~${window.location.href}`;
	const reducer = persistReducer(
		{
			key,
			storage, // storage is now required
			whitelist: ["checkout", "showingButtons"]
		},
		rootReducer
	);

	const store = createStore(
		reducer,
		initialState,
		storeEnhancers(storeEnhancements)
	);

	return {
		persistor: persistStore(store),
		store
	};
}
