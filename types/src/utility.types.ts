type IsPrimitive<T> = T extends number | string | boolean | null | undefined
	? T
	: never;

type Transform<T> = T extends Date
	? string
	: T extends object
	? Client<T>
	: IsPrimitive<T>;

export type Client<T> = {
	[K in keyof T]: Transform<T[K]>;
};

export type Titleize<S extends string> = S extends `${infer T}${infer U}`
	? `${Uppercase<T>}${Lowercase<U>}`
	: S;

export type IPagedResponse<T> = {
	data: Client<T>[];
	page: {
		count: number;
		limit: number;
		start: string;
		nextKey: string | null;
	};
};

export type Primative = string | number | boolean | null | undefined;
export type PrimativeArray = (Primative | PrimativeArray)[];
