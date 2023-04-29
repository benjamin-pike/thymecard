import { Types } from "mongoose";

export type TypeGuard<T> = (v: unknown) => v is T;

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

export const isPlainObject = (obj: any): obj is Object => {
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

export const isOptional = <T>(val: any, typeGuard: TypeGuard<T>): val is T | undefined => {
    return typeof val === 'undefined' || typeGuard(val);
}

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

export const isValidMongoId = (val: string): boolean => {
    try {
        new Types.ObjectId(val);
        return true;
    } catch {
        return false;
    }
};


export const parseIntOrUndefined = (val: string): number | undefined => {
    const parsed = parseInt(val);
    return validateWithFallback(parsed, isNumber, undefined)
};

export const parseFloatOrUndefined = (val: string): number | undefined => {
    const parsed = parseFloat(val);
    return validateWithFallback(parsed, isNumber, undefined)
};