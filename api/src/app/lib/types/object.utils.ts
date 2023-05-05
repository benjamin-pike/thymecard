import { isPlainObject, isArray } from './typeguards.utils';

export const filterObjectKeys = (obj: Record<string, any>, keys: string[]): Record<string, any> => {
    const processObject = (obj: Record<string, any>, excludeKeys: string[], parentKey = ''): Record<string, any> => {
        const result: Record<string, any> = {};

        for (const key in obj) {
            const fullPath = parentKey ? `${parentKey}.${key}` : key;
            if (!excludeKeys.includes(fullPath)) {
                if (isPlainObject(obj[key]) && !isArray(obj[key])) {
                    result[key] = processObject(obj[key], excludeKeys, fullPath);
                } else {
                    result[key] = obj[key];
                }
            }
        }

        return result;
    };

    if (!obj || !keys || keys.length === 0) {
        return obj;
    }

    return processObject(obj, keys);
};

export const getPath = <T extends object, K extends keyof T>(obj: T, path: string): T[K] | undefined => {
    const keys = path.split('.');
    let result: any = obj;

    for (const key of keys) {
        if (result == null) return undefined;
        if (Array.isArray(result)) {
            result = result[parseInt(key)];
        } else {
            result = result[key as keyof typeof result];
        }
    }

    return result;
};
