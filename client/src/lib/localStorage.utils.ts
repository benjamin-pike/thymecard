import { TypeGuard } from './type.utils';

export const getLocalStorageItem = <T>(key: string, typeguard: TypeGuard<T>) => {
    try {
        const item = JSON.parse(localStorage.getItem(key) ?? '{}');

        if (!typeguard(item)) {
            throw new Error();
        }

        return item;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const setLocalStorageItem = <T>(key: string, item: T, typeguard: TypeGuard<T>) => {
    try {
        if (!typeguard(item)) {
            throw new Error();
        }

        localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
        console.error(err);
    }
};

export const removeLocalStorageItem = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.error(err);
    }
};
