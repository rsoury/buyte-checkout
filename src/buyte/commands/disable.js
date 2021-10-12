import Store from "@/buyte/store";
import { disableWidget } from "@/actions";
import { trigger } from "./callback-registry";

const disable = () => {
	const store = Store.get();

	store.dispatch(disableWidget());

	trigger("onDisable")();
};

export default disable;
