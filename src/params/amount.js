export function match(value) {
	const amount = +value;

	if (isNaN(amount)) return false;
	if (amount > 9) return false;

	return true;
}
