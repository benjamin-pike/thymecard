import { useCallback, useRef } from 'react';

type Callback = (...args: any[]) => void;

export const useDebounce = (func: Callback, delay: number): Callback => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const callback = useCallback(
        (...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                func(...args);
            }, delay);
        },
        [func, delay]
    );

    return callback;
};
