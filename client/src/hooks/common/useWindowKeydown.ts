import { useCallback } from 'react';
import { isDefined } from '@/lib/type.utils';
import { useWindowEventListener } from './useWindowEventListener';

export const useWindowKeyDown = (key: string, callback: (e: KeyboardEvent) => void) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isDefined(window)) {
                return;
            }

            if (e.key === key) {
                callback(e);
            }
        },
        [key, callback]
    );

    useWindowEventListener('keydown', handleKeyDown);
};
