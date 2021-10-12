// Dynamically load all commands when a command is routed.
// Get command as handler from the dynamically imported module.

// This file is dynamically imported. Should include some means of tracking inheritly.
import { track } from "@/utils/tracking";
import { BUYTE_COMMAND } from "@/constants/event-tracking-types";

const router = async ([command, ...args]) => {
	const { [command]: handler } = await import("./commands").then(m =>
		m.default ? m.default : m
	);
	if (typeof handler === "function") {
		handler(...args);

		// Track command and arguments being executed
		track(BUYTE_COMMAND, {
			command,
			args: JSON.stringify(
				args.map(arg => (typeof arg === "function" ? arg.toString() : arg))
			)
		});
	}
};

export default router;
