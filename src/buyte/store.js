import { noStoreError } from "@/errors";

class Store {
	static store = null;

	static set(store) {
		this.store = store;
		return this.store;
	}

	static get() {
		if (!this.store) {
			noStoreError();
		}
		return this.store;
	}
}

export default Store;
