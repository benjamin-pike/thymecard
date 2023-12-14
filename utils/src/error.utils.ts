export const standardizeErrorCode = (code: number) => {
	return `E-${code.toString().padStart(4, "0")}`;
};
