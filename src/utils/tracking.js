/* eslint-disable no-console */
// A single config and functions concerning error, user, session, etc. Tracking

import amplitude from "amplitude-js";
import * as Sentry from "@sentry/browser";
import ono from "ono";

import {
	isProd,
	eventTracking,
	amplitudeKey,
	sentryDSN
} from "@/utils/env-config";

// Initialise tools.
export const initTracking = (defaultSentryBehaviour = false, deviceId) => {
	if (isProd) {
		if (amplitudeKey) {
			amplitude.getInstance().init(
				amplitudeKey,
				null,
				deviceId
					? {
							deviceId
					  }
					: null
			);
		}
		if (sentryDSN) {
			const sentryConfig = {
				dsn: sentryDSN,
				environment: isProd ? "production" : "development"
			};
			if (!defaultSentryBehaviour) {
				sentryConfig.defaultIntegrations = false;
			}
			Sentry.init(sentryConfig);
		}
	}
};

// Function that accepts error and some message for error tracking.
export const handleException = (e, properties, message) => {
	if (e) {
		if (isProd && sentryDSN) {
			const err = ono(e, properties, message);
			Sentry.captureException(err);
		} else {
			console.error(e, properties, message);
		}
	}
};

// Identify user for tracking purposes.
export const identifyUser = (id, traits = {}) => {
	if (!id) {
		return;
	}
	if (amplitudeKey) {
		amplitude.getInstance().setUserId(id);
		amplitude.getInstance().setUserProperties(traits);
	}
	if (sentryDSN) {
		Sentry.configureScope(scope => {
			scope.setUser({ id });
		});
	}
};

// Track events.
export const track = (eventType, eventProperties) => {
	if (eventTracking) {
		if (isProd && amplitudeKey) {
			amplitude.getInstance().logEvent(eventType, eventProperties);
		} else {
			console.log(`Track:`, eventType, ":", eventProperties);
		}
	}
};

// Get background tracking info
export const getBackgroundInfo = () => {
	return amplitude.getInstance().options;
};
