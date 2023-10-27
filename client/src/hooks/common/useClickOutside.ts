import { RefObject, useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>(
    callback: (event: MouseEvent) => void,
    exemptElements?: (HTMLElement | null)[]
): RefObject<T> => {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                if (exemptElements && exemptElements.some((element) => element && element.contains(event.target as Node))) {
                    return;
                }
                callback(event);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback, exemptElements]);

    return ref;
};
