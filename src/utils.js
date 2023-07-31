export function str2Hex(hex) {
	return Number(`0x${hex.substr(1)}`);
}
