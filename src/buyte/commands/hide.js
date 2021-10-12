import Store from "@/buyte/store";
import { hideWidget } from "@/actions";
import { trigger } from "./callback-registry";

const hide = () => {
	const store = Store.get();

	store.dispatch(hideWidget());

	trigger("onHide")();
};

export default hide;
