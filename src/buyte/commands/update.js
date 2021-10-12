import clone from "clone";
import Store from "@/buyte/store";
import { updateCheckout } from "@/actions";

const update = async (providedSettings = {}) => {
	const settings = clone(providedSettings);
	const store = Store.get();
	store.dispatch(updateCheckout(settings));
};

export default update;
