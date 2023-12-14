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

export const buildUrl = (
	path: string,
	options: {
		base?: string;
		params?: Record<string, string>;
		query?: Record<string, string | number | boolean>;
	} = {}
): string => {
	const { base, params, query } = options;

	let url = (base ?? '') + path;

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url = url.replace(`:${key}`, `${encodeURIComponent(value)}`);
		});
	}

	if (query) {
		url = url + "?";

		Object.entries(query).forEach(([key, value]) => {
			url = url + `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}&`;
		});
	}

	return url.toString();
};
