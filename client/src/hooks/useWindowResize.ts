import { useEffect } from 'react';
import { isDefined } from '@/lib/type.utils';

export interface IWindowDimensions {
    width: number;
    height: number;
}

export const useWindowResize = (callback: (args: IWindowDimensions) => void) => {
    useEffect(() => {
        const handleResize = () => {
            if (!isDefined(window)) {
                return;
            }
            callback({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [callback]);
};
