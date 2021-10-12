import Store from "@/buyte/store";
import { enableWidget } from "@/actions";
import { trigger } from "./callback-registry";

const enable = () => {
	const store = Store.get();

	store.dispatch(enableWidget());

	trigger("onEnable")();
};

export default enable;
