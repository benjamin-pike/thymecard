import { useEffect } from 'react';
import { isDefined } from '@/lib/type.utils';

export const useWindowKeyDown = (key: string, callback: (e: KeyboardEvent) => void) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isDefined(window)) {
                return;
            }

            if (e.key === key) {
                callback(e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [key, callback]);
};