// Where functions are registered against names.
import _cloneDeep from "lodash.clonedeep";

const Registry = {};

/**
	Initialise array on Registry[name]
	Push function into a array of registered functions under that given trigger.
*/
const register = name => {
	return func => {
		if (typeof func === "function") {
			Registry[name] = Object.prototype.hasOwnProperty.call(Registry, name)
				? Registry[name]
				: [];
			Registry[name].push(func);
		}
	};
};

/**
	Trigger accepts name for registry, and returns function that accepts any number of arguments.
	If name exists, check if array initialised or if function registered directly against it.
	Either loop through array to trigger each function or trigger the function registered directly.
*/
export const trigger = name => {
	return (...receivedArgs) => {
		const args = _cloneDeep(receivedArgs);
		if (Object.prototype.hasOwnProperty.call(Registry, name)) {
			if (Array.isArray(Registry[name])) {
				Registry[name].forEach(fn => {
					fn(...args);
				});
			} else {
				Registry[name](...args);
			}
		}
	};
};

/**
	Checks if trigger exists
*/
export const triggerExists = name =>
	Object.prototype.hasOwnProperty.call(Registry, name);

export default register;
