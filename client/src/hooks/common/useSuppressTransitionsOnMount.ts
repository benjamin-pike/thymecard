import { useEffect, useRef, RefObject } from 'react';

export const useSuppressTransitionsOnMount = <T extends HTMLElement = any>(delay?: number): RefObject<T> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.classList.add('no-transition');
        }

        const timeout = setTimeout(() => {
            if (ref.current) {
                ref.current.classList.remove('no-transition');
            }
        }, delay ?? 100);

        return () => clearTimeout(timeout);
    }, [delay]);

    return ref;
};
