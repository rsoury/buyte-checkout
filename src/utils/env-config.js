let prod = process.env.NODE_ENV === "production";
const force = process.env.REACT_APP_FORCE_ENV;
if (force) {
	prod = force === "production";
}

const envHasTabs = process.env.REACT_APP_BROWSER_HAS_TABS;
const envIsSupported = process.env.REACT_APP_BROWSER_IS_SUPPORTED;

export const forceEnv = force;
export const isProd = prod;
export const reduxLogger = process.env.REACT_APP_REDUX_LOGGER === "true";
export const envBrowserIsSupported =
	typeof envIsSupported !== "undefined"
		? envIsSupported === true || envIsSupported === "true"
		: true;
export const envBrowserHasTabs =
	typeof envHasTabs !== "undefined"
		? envHasTabs === true || envHasTabs === "true"
		: true;
export const goUrl = process.env.REACT_APP_GO_URL;
export const apiUrl = process.env.REACT_APP_API_URL;
export const eventTracking = process.env.REACT_APP_EVENT_TRACKING === "true";
export const sentryDSN = process.env.REACT_APP_SENTRY_DSN;
export const amplitudeKey = process.env.REACT_APP_AMPLITUDE_API_KEY;
export const debugConfirmDialog = process.env.REACT_APP_DEBUG_CONFIRM_DIALOG;

if (!apiUrl) {
	/* eslint-disable no-console */
	console.error(`No API Url loaded!`);
}

if (!goUrl) {
	/* eslint-disable no-console */
	console.error(`No Go Buyte Checkout URL loaded`);
}
