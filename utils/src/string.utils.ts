export const toTitleCase = (str: string): string => {
	const exceptions = [
		"a",
		"an",
		"the",
		"and",
		"but",
		"or",
		"for",
		"nor",
		"on",
		"at",
		"to",
		"from",
		"by",
		"in",
		"of",
		"with",
		"over",
		"under"
	];

	return str
		.toLowerCase()
		.replace(
			/\w\S*/g,
			(word: string, index: number, fullString: string) => {
				if (
					index === 0 ||
					index + word.length === fullString.length ||
					!exceptions.includes(word)
				) {
					return word.charAt(0).toUpperCase() + word.substr(1);
				}
				return word;
			}
		);
};

export const removeHTML = (str: string): string => {
	return str.replace(/<[^>]*>?/gm, "");
};

type Primative = string | number | boolean | null | undefined;
type PrimativeArray = (Primative | PrimativeArray)[];
export const buildKey = (...args: (Primative | PrimativeArray)[]): string => {
	return args.join("::");
};
