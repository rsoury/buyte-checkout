/* eslint-disable import/prefer-default-export */

import { debugConfirmDialog } from "../env-config";
import * as buttonTypes from "@/constants/button-types";

export const getPaymentAuthorisation = async () => {
	// Only perform debug if env set
	if (typeof debugConfirmDialog === "string") {
		if (Object.keys(buttonTypes).includes(debugConfirmDialog)) {
			const paymentAuthorisation = await import("./authorisedPayment").then(m =>
				m.default ? m.default : m
			);
			return paymentAuthorisation[debugConfirmDialog];
		}
	}
	return null;
};
