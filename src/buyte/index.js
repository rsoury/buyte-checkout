// Where we route and register the different commands, and arguments.w

let Registry = [];
// Make sure there is only one execution process at a time.
let isExecuting = false;

// First accept immediate commands and load their required handles asynchronously
export default function(...args) {
	Registry.push(args);
}

const init = async () => {
	// Some page tracking
	const { initTracking } = await import("@/utils/tracking");
	initTracking();

	// Define execute inside the load handler in order to use the router that also loads through code splitting.
	const router = await import("./router").then(m =>
		m.default ? m.default : m
	);
	const execute = () => {
		if (!isExecuting) {
			isExecuting = true;
			while (Registry.length > 0) {
				const args = Registry.shift();
				// console.log(`Executing: ${args[0]}`);
				// console.log(args);
				router(args);
			}
			isExecuting = false;
		}
	};

	// Register the listener for newly pushed commands.
	const onChange = await import("on-change").then(m =>
		m.default ? m.default : m
	);
	// Redefine Registry as a Proxy array where items are watched for modification/addition, and if they are run execute.
	Registry = onChange([...Registry], () => {
		execute();
	});

	// Then begin executing any commands in the registry.
	execute();
};

const load = async () => {
	// Polyfill where we need it before loading the script.
	if (typeof Proxy === "undefined") {
		window.Proxy = await import("proxy-polyfill/src/proxy").then(m =>
			m.default ? m.default : m
		);
	}
	if (typeof Promise === "undefined") {
		window.Promise = await import("promise-polyfill/src/polyfill").then(m =>
			m.default ? m.default : m
		);
	}

	// Initiate
	await init();
};
if (document.readyState === "complete") {
	load();
} else if (window.attachEvent) {
	window.attachEvent("onload", load);
} else {
	window.addEventListener("load", load);
}
