import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const readValue = useCallback((): T => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : (initialValue as T);
        } catch (error) {
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState(readValue);

    const setValue = useCallback(
        (value: T) => {
            window.localStorage.setItem(key, JSON.stringify(value));

            setStoredValue(value);

            window.dispatchEvent(new Event('local-storage'));
        },
        [key]
    );

    useEffect(() => {
        setStoredValue(readValue());
    }, [readValue]);

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue());
        };

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [readValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;
