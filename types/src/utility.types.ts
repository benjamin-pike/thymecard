type IsPrimitive<T> = T extends number | string | boolean | null | undefined ? T : never;

type Transform<T> =
    T extends Date ? string :
    T extends object ? Client<T> : 
    IsPrimitive<T>;

export type Client<T> = {
    [K in keyof T]: Transform<T[K]>;
};