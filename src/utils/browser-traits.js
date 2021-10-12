/* eslint-disable no-console */

import { detect } from "detect-browser";
import { isProd, envBrowserHasTabs, envBrowserIsSupported } from "./env-config";

const browser = detect();

let browserTraits = {
	isSupported: true,
	hasTabs: true
};

if (!isProd) {
	console.log(`Browser: `, browser);
	browserTraits = {
		isSupported: envBrowserIsSupported,
		hasTabs: envBrowserHasTabs
	};
} else {
	switch (browser.name) {
		case "edge":
		case "yandexbrowser":
		case "samsung":
		case "edge-chromium":
		case "chrome":
		case "crios":
		case "android":
		case "ios":
		case "safari":
		case "firefox":
		case "opera":
			browserTraits = {
				isSupported: true,
				hasTabs: true
			};
			break;
		// case "kakaotalk":
		// case "chromium-webview":
		// case "ios-webview":
		// case "facebook":
		// case "instagram":
		// case "fxios":
		// case "opera-mini":
		// 	browserTraits = {
		// 		isSupported: true,
		// 		hasTabs: false
		// 	};
		// 	break;
		default:
			browserTraits = {
				isSupported: false,
				hasTabs: false
			};
			break;
	}
}

export const { isSupported } = browserTraits;
export const { hasTabs } = browserTraits;

const traits = browserTraits;
export default traits;
