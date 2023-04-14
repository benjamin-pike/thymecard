import { Types } from 'mongoose';

export type TypeGuard<T> = (v: unknown) => v is T;

export const isDefined = <T>(val: T | undefined): val is T => {
    return val !== undefined;
};

export const isString = (val: unknown): val is string => {
    return typeof val === 'string';
};

export const isNumber = (val: unknown): val is number => {
    return typeof val === 'number';
};

export const isBoolean = (val: unknown): val is boolean => {
    return typeof val === 'boolean';
};

export const isArray = <T>(val: unknown): val is T[] => {
    return Array.isArray(val);
};

export const isArrayOf = <T>(typeGuard: TypeGuard<T>, val: unknown): val is T[] => {
    return Array.isArray(val) && val.every(typeGuard);
};

export const isObject = (val: unknown): val is object => {
    return typeof val === 'object' && val !== null;
};

export const isPlainObject = (obj: any): boolean => {
    if (!isObject(obj)) {
        return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
};

export function hasKey<T extends object, K extends string>(obj: T, key: K): obj is T & Record<K, unknown> {
    return key in obj;
}

export const validateWithNull = <T>(typeGuard: TypeGuard<T>, val: unknown): T | null => {
    if (!typeGuard(val)) {
        return null;
    }
    return val;
};

export const validateWithError = <T>(typeGuard: TypeGuard<T>, val: unknown, err: Error): T => {
    if (!typeGuard(val)) {
        throw err;
    }
    return val;
};

export const validateWithFallback = <T>(typeGuard: TypeGuard<T>, val: unknown, fallback: T): T => {
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
