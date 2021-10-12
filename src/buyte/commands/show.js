import Store from "@/buyte/store";
import { showWidget } from "@/actions";
import { trigger } from "./callback-registry";

const show = () => {
	const store = Store.get();

	store.dispatch(showWidget());

	trigger("onShow")();
};

export default show;
