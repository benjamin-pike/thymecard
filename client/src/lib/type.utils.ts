export type TypeGuard<T> = (v: unknown) => v is T;

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P] | undefined>;
};

export const isDefined = <T>(val: T | undefined): val is T => {
    return val !== undefined;
};

export const isString = (val: unknown): val is string => {
    return typeof val === 'string';
};

export const isNonEmptyString = (val: unknown): val is string => {
    return isString(val) && val.length > 0;
};

export const isNumber = (val: unknown): val is number => {
    return typeof val === 'number' && !Number.isNaN(val);
};

export const isBoolean = (val: unknown): val is boolean => {
    return typeof val === 'boolean';
};

export const isArray = <T>(val: unknown): val is T[] => {
    return Array.isArray(val);
};

export const isArrayOf = <T>(val: unknown, typeGuard: TypeGuard<T>): val is T[] => {
    return Array.isArray(val) && val.every(typeGuard);
};

export const isObject = (val: unknown): val is object => {
    return typeof val === 'object' && val !== null;
};

export const isPlainObject = (obj: any): obj is object => {
    if (!isObject(obj)) {
        return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
};

export const isRecord = <T>(val: unknown, typeGuard: TypeGuard<T>): val is Record<string, T> => {
    if (!isPlainObject(val)) {
        return false;
    }

    return Object.values(val).every(typeGuard);
};

export const isDate = (val: unknown): val is Date => {
    return val instanceof Date;
};

export const isOptional = <T>(val: any, typeGuard: TypeGuard<T>): val is T | undefined => {
    return typeof val === 'undefined' || typeGuard(val);
};

export function hasKey<T extends object, K extends string>(obj: T, key: K): obj is T & Record<K, unknown> {
    return key in obj;
}

export const validateWithNull = <T>(val: unknown, typeGuard: TypeGuard<T>): T | null => {
    if (!typeGuard(val)) {
        return null;
    }
    return val;
};

export const validateWithError = <T>(val: unknown, typeGuard: TypeGuard<T>, err: Error): T => {
    if (!typeGuard(val)) {
        throw err;
    }
    return val;
};

export const validateWithFallback = <T>(val: unknown, typeGuard: TypeGuard<T>, fallback: T): T => {
    if (!typeGuard(val)) {
        return fallback;
    }
    return val;
};

export const isDateString = (val: unknown): val is string => {
    if (!isString(val)) {
        return false;
    }

    const date = new Date(val);
    return !isNaN(date.getTime());
};

export const isISODateString = (val: unknown): val is string => {
    if (!isString(val)) {
        return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    return !dateRegex.test(val);
};

export const isFutureYearMonthDayDateString = (val: unknown): val is string => {
    if (!isISODateString(val)) {
        return false;
    }

    const date = new Date(val);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return date.getTime() >= today.getTime();
};

export const parseIntOrUndefined = (val: string | undefined): number | undefined => {
    return validateWithFallback(parseInt(val ?? ''), isNumber, undefined);
};

export const parseIntOrNull = (val: string | undefined): number | null => {
    return validateWithFallback(parseFloat(val ?? ''), isNumber, null);
};

export const parseFloatOrUndefined = (val: string | undefined): number | undefined => {
    return validateWithFallback(parseFloat(val ?? ''), isNumber, undefined);
};

export const parseFloatOrNull = (val: string | undefined): number | null => {
    return validateWithFallback(parseFloat(val ?? ''), isNumber, null);
};

export const parseBooleanOrFalse = (val: any): boolean => {
    if (val === 'true' || val === '1') {
        return true;
    }

    return false;
};
