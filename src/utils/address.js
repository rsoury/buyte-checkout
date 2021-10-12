/* eslint-disable import/prefer-default-export */

import isEmpty from "is-empty";
import { getName } from "country-list";

export const addressToString = (address = {}) => {
	const country =
		address.country ||
		(address.countryCode ? getName(address.countryCode) : "");
	const pieces = [];
	if (address.addressLines.length > 0) {
		pieces.push(address.addressLines.join(", "));
	}
	pieces.push(
		`${address.locality} ${address.administrativeArea} ${address.postalCode}`
	);
	pieces.push(country);
	const output = pieces.filter(piece => !isEmpty(piece)).join(", ");

	return output;
};
