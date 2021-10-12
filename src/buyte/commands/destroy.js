import Store from "@/buyte/store";
import { destroyWidget } from "@/actions";
import { trigger } from "./callback-registry";

const destroy = () => {
	const store = Store.get();

	store.dispatch(destroyWidget());

	trigger("onDestroy")();
};

export default destroy;
