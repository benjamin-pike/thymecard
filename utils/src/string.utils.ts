import { Primative, PrimativeArray } from "@thymecard/types";

export const toTitleCase = (str: string): string => {
	const exceptions = [
        // conjunctionns, prepositions, and articles
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
		"under",

        // abbreviations
        "BBQ"
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

export const buildKey = (...args: (Primative | PrimativeArray)[]): string => {
	return args.join("::");
};

export const buildUrl = (
	path: string,
	options: {
		base?: string;
		params?: Record<string, Primative>;
		query?: Record<string, Primative>;
	} = {}
): string => {
	const { base, params, query } = options;

	let url = (base ?? "") + path;

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value) {
				url = url.replace(
					`:${key}`,
					`${encodeURIComponent(value.toString())}`
				);
			}
		});
	}

	if (query) {
		url = url + "?";

		Object.entries(query).forEach(([key, value], i, arr) => {
            if (value) {
                url =
                    url +
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        value.toString()
                    )}${i < arr.length - 1 ? "&" : ""}`;
            }
		});
	}

	return url.toString();
};
