import isEmpty from "is-empty";
import deepEqual from "deep-equal";
import produce from "immer";

import * as types from "@/constants/action-types";
import * as buttonTypes from "@/constants/button-types";
import * as errors from "@/errors";
import { trigger } from "@/buyte/commands/callback-registry";
import { handleException } from "@/utils/tracking";
import * as validate from "@/actions/validation";
import initApi from "@/api";

export function loadCheckoutSuccess(payload) {
	return { type: types.LOAD_CHECKOUT, payload };
}
export function loadCheckoutFail() {
	return { type: types.HIDE_WIDGET };
}
export function destroyWidget() {
	return { type: types.DESTROY_WIDGET };
}
export function showWidget() {
	return { type: types.SHOW_WIDGET };
}
export function hideWidget() {
	return { type: types.HIDE_WIDGET };
}
export function disableWidget() {
	return { type: types.DISABLE_WIDGET };
}
export function enableWidget() {
	return { type: types.ENABLE_WIDGET };
}
export function updateCheckoutSuccess(payload) {
	return { type: types.UPDATE_CHECKOUT, payload };
}
export function addShowingButton(payload) {
	return { type: types.ADD_SHOWING_BUTTON, payload };
}
export function removeShowingButton(payload) {
	return { type: types.REMOVE_SHOWING_BUTTON, payload };
}
export function updateLoadingStatus(payload) {
	return { type: types.UPDATE_LOADING, payload };
}

export function addItem(item) {
	const payload = validate.addItem(item);
	if (typeof payload !== "object" || isEmpty(payload)) {
		return { type: "" };
	}
	return { type: types.ADD_ITEM, payload };
}
export function removeItem(item) {
	const payload = validate.removeItem(item);
	if (typeof payload !== "object" || isEmpty(payload)) {
		return { type: "" };
	}
	return { type: types.REMOVE_ITEM, payload };
}

export function loadShippingMethods(shippingMethods = []) {
	const payload = validate.shippingMethods(shippingMethods);
	if (isEmpty(payload)) {
		// TODO: Disable pay button and spit some message under shipping that says, "no shipping methods available"
		return { type: "" };
	}
	return { type: types.LOAD_SHIPPING_METHODS, payload };
}

export function updateAuthorisedPayment(payload) {
	return { type: types.UPDATE_AUTHORISED_PAYMENT, payload };
}

export function createPaymentTokenSuccess(payload) {
	return { type: types.UPDATE_PAYMENT_TOKEN, payload };
}

export function loadCheckout() {
	return (dispatch, getState) => {
		const { settings = {} } = getState();
		const { publicKey, widgetId, options } = settings;
		return initApi(publicKey)
			.getFullCheckout(widgetId, options)
			.then(checkout => dispatch(loadCheckoutSuccess(checkout)))
			.then(() => trigger("onReady")(settings))
			.catch(e => {
				handleException(e, { settings }, "Cannot load checkout");
				errors.cannotLoadCheckoutError(e);
				trigger("onError")("LOAD_ERROR");
				dispatch(loadCheckoutFail());
			});
	};
}

export function updateCheckout(newSettings = {}) {
	return (dispatch, getState) => {
		const { settings: stateSettings = {}, checkout } = getState();
		if (deepEqual(stateSettings, newSettings)) {
			trigger("onUpdate")(stateSettings);
			return;
		}
		const isNewCheckout =
			newSettings.publicKey !== stateSettings.publicKey ||
			newSettings.widgetId !== stateSettings.widgetId ||
			!deepEqual(newSettings.options, stateSettings.options);

		// Apply new settings to setings.
		const settings = produce(stateSettings, draftSettings => {
			const draft = draftSettings;
			Object.entries(newSettings).forEach(([key, value]) => {
				if (key === "items") {
					if (Array.isArray(value)) {
						if (value.length > 0) {
							// Format items on update for settings.
							draft[key] = value
								.map(item => validate.addItem(item, false))
								.filter(item => typeof item === "object" && !isEmpty(item));
						}
					}
				} else {
					draft[key] = value;
				}
			});
		});

		// Don't even dispatch more items, just replace it using same validation helpers...
		let items;
		if (Array.isArray(newSettings.items)) {
			if (newSettings.items.length > 0) {
				items = newSettings.items
					.map(item => validate.addItem(item))
					.filter(item => typeof item === "object" && !isEmpty(item));
			}
		}

		if (isNewCheckout) {
			const { publicKey, widgetId, options } = settings;
			initApi(publicKey)
				.getFullCheckout(widgetId, options)
				.then(fullCheckout =>
					dispatch(
						updateCheckoutSuccess({
							settings,
							checkout: fullCheckout,
							items
						})
					)
				)
				.then(() => trigger("onUpdate")(settings))
				.catch(e => {
					handleException(e, { settings }, "Cannot retrieve updated checkout");
					errors.cannotLoadCheckoutError(e);
					trigger("onError")("UPDATE_ERROR");
				});
		} else {
			dispatch(
				updateCheckoutSuccess({
					settings,
					checkout,
					items
				})
			);
			trigger("onUpdate")(settings);
		}
	};
}

const consumePaymentToken = dispatch => {
	dispatch(updateLoadingStatus(false));
	// payment token consumed and cleared
	dispatch(createPaymentTokenSuccess(null));
};

export function createPaymentToken(shippingMethodId) {
	return (dispatch, getState) => {
		// Show loader to user
		dispatch(updateLoadingStatus(true));

		const {
			settings,
			authorisedPaymentData,
			isShippingEnabled,
			shippingMethods
		} = getState();
		const authorisedPayment = {
			...authorisedPaymentData
		};
		if (isShippingEnabled) {
			// If shipping enabled, append method to payload, and modify amount to include method amoutn.
			const method = shippingMethods.find(({ id }) => id === shippingMethodId);
			if (isEmpty(method)) {
				return handleException(
					new Error("Could not find selected shipping method")
				);
			}
			authorisedPayment.shippingMethod = method;
			authorisedPayment.amount += method.rate || 0;
		}

		const api = initApi(settings.publicKey);
		return (() => {
			switch (authorisedPayment.type) {
				case buttonTypes.APPLE_PAY: {
					return api.processApplePayPayment(authorisedPayment);
				}
				case buttonTypes.GOOGLE_PAY: {
					return api.processGooglePayPayment(authorisedPayment);
				}
				default: {
					return Promise.reject(
						new Error("No valid type specified for createPaymentToken.")
					);
				}
			}
		})()
			.then(paymentToken => {
				dispatch(createPaymentTokenSuccess(paymentToken));
				trigger("onPayment")(paymentToken, () => {
					consumePaymentToken(dispatch);
				});
			})
			.catch(e => {
				handleException(
					e,
					{ authorisedPayment, settings },
					"Could not create new payment token"
				);
			});
	};
}
