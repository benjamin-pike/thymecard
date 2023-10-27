import { useCallback } from 'react';
import { isDefined } from '@/lib/type.utils';
import { useWindowEventListener } from './useWindowEventListener';

export interface IWindowDimensions {
    width: number;
    height: number;
}

export const useWindowResize = (callback: (args: IWindowDimensions) => void) => {
    const handleResize = useCallback(() => {
        if (!isDefined(window)) {
            return;
        }
        callback({ width: window.innerWidth, height: window.innerHeight });
    }, [callback]);

    useWindowEventListener('resize', handleResize);
};
