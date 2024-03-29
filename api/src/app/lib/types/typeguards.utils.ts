import { Types } from 'mongoose';

export type TypeGuard<T> = (v: unknown) => v is T;

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P] | undefined>;
};

export type DeepOmit<T, K extends keyof any> = T extends object
    ? {
          [P in keyof T]: P extends K ? never : P extends keyof T ? DeepOmit<T[P], K> : never;
      }
    : T;

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

export const isNumberString = (val: unknown): val is string => {
    return isString(val) && isNumber(parseInt(val, 10));
};

export const isArray = <T>(val: unknown): val is T[] => {
    return Array.isArray(val);
};

export const isArrayOf = <T>(val: unknown, typeGuard: TypeGuard<T>): val is T[] => {
    return Array.isArray(val) && val.every(typeGuard);
};

export const isObject = (val: unknown): val is Object => {
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

export const isDate = (val: unknown): val is Date => {
    return val instanceof Date;
};

export const isOptional = <T>(val: any, typeGuard: TypeGuard<T>): val is T | undefined => {
    return typeof val === 'undefined' || typeGuard(val);
};

export function hasKey<T extends object, K extends string>(obj: T, key: K): obj is T & Record<K, unknown> {
    return key in obj;
}

export function validate<T, R = T>(val: unknown, typeGuard: TypeGuard<T>, err?: Error, callback?: (value: T) => R): R;
export function validate<T, F, R = T | F>(val: unknown, typeGuard: TypeGuard<T>, fallback?: F, callback?: (value: T) => R): R;

export function validate<T, F, R>(
    val: unknown,
    typeGuard: TypeGuard<T>,
    fallbackOrError?: F | Error,
    callback?: (value: T | F) => R
): T | F | R | undefined {
    const error = fallbackOrError instanceof Error ? fallbackOrError : undefined;
    const fallback = fallbackOrError instanceof Error ? undefined : fallbackOrError;

    if (!typeGuard(val)) {
        if (fallback !== undefined) {
            return fallback;
        }

        if (error) {
            throw error;
        }

        return;
    }

    if (callback) {
        return callback(val);
    }

    return val;
}

export const isValidMongoId = (val: any): val is string => {
    if (!isString(val)) {
        return false;
    }

    try {
        new Types.ObjectId(val);
        return true;
    } catch {
        return false;
    }
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

    return dateRegex.test(val);
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
    return validate(parseInt(val ?? ''), isNumber, undefined);
};

export const parseIntOrNull = (val: string | undefined): number | null => {
    return validate(parseFloat(val ?? ''), isNumber, null);
};

export const parseFloatOrUndefined = (val: string | undefined): number | undefined => {
    return validate(parseFloat(val ?? ''), isNumber, undefined);
};

export const parseFloatOrNull = (val: string | undefined): number | null => {
    return validate(parseFloat(val ?? ''), isNumber, null);
};

export const parseBooleanOrFalse = (val: any): boolean => {
    if (val === 'true' || val === '1') {
        return true;
    }

    return false;
};
