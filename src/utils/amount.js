// Accepts 100.00 an returns 10000
export const getAmount = formatted =>
	parseInt(Math.round(parseFloat(formatted) * 100), 10);

// Accepts 10000 and returns 100.00
export const formatAmount = amount => (amount / 100).toFixed(2);
