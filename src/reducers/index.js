import produce, { setAutoFreeze } from "immer";
import * as types from "@/constants/action-types";
import initialState from "./initial-state";

// Disable auto freeze to ensure ReduxPersist can modify the response state.
setAutoFreeze(false);

function rootReducer(state = initialState, action) {
	return produce(state, draftState => {
		const draft = draftState;
		switch (action.type) {
			case types.LOAD_CHECKOUT: {
				draft.checkout = action.payload;
				break;
			}
			case types.DESTROY_WIDGET: {
				draft.isDestroyed = true;
				break;
			}
			case types.SHOW_WIDGET: {
				draft.show = true;
				break;
			}
			case types.HIDE_WIDGET: {
				draft.show = false;
				break;
			}
			case types.ENABLE_WIDGET: {
				draft.isEnabled = true;
				break;
			}
			case types.DISABLE_WIDGET: {
				draft.isEnabled = false;
				break;
			}
			case types.ADD_ITEM: {
				const { items = [] } = state;
				if (items.findIndex(item => item.id === action.payload.id) < 0) {
					draft.items = [...items, action.payload];
				}
				break;
			}
			case types.REMOVE_ITEM: {
				const { items = [] } = state;
				const newItems = items.filter(item => item.id !== action.payload.id);
				draft.items = newItems;
				break;
			}
			case types.UPDATE_CHECKOUT: {
				// Destructure settings items to prevent invariation
				const { settings, checkout, items } = action.payload;
				draft.settings = settings;
				draft.checkout = checkout;
				if (Array.isArray(items)) {
					draft.items = [...items];
				}
				break;
			}
			case types.ADD_SHOWING_BUTTON: {
				const showingButtons = state.showingButtons.filter(
					button => button !== action.payload
				);
				showingButtons.push(action.payload);
				draft.showingButtons = showingButtons;
				break;
			}
			case types.REMOVE_SHOWING_BUTTON: {
				const showingButtons = state.showingButtons.filter(
					button => button !== action.payload
				);
				draft.showingButtons = showingButtons;
				break;
			}
			case types.LOAD_SHIPPING_METHODS: {
				draft.shippingMethods = action.payload;
				break;
			}
			case types.UPDATE_AUTHORISED_PAYMENT: {
				draft.authorisedPaymentData = action.payload;
				break;
			}
			case types.UPDATE_LOADING: {
				draft.isLoading = action.payload;
				break;
			}
			case types.UPDATE_PAYMENT_TOKEN: {
				draft.paymentToken = action.payload;
				break;
			}
			default: {
				break;
			}
		}
	});
}

export default rootReducer;
