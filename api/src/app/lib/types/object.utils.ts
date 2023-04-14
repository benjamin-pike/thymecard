import { isPlainObject, isArray } from './types.utils';

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
