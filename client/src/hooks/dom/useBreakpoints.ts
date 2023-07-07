import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@mantine/hooks';

import { setViewportSize, setCustomViewportSize } from '@/store/slices/viewport';
import { RootState } from '@/store';

type DefaultBreakpoint = 'mobile' | 'small' | 'medium' | 'large' | 'xlarge';

interface BreakpointParams<T = string> {
    name: T;
    min: number;
    max: number;
}

interface IViewportBase {
    isXLarge: boolean;
    isLarge: boolean;
    isMedium: boolean;
    isSmall: boolean;
    isMobile: boolean;
}

export interface IViewport {
    current: IViewportBase & { [key: string]: boolean };
    isSmallerThan: (size: DefaultBreakpoint) => boolean;
    isLargerThan: (size: DefaultBreakpoint) => boolean;
    getCurrentSize: () => string;
    getCurrentCustomSize: () => string;
}

const defaultBreakpoints: BreakpointParams<DefaultBreakpoint>[] = [
    { name: 'mobile', min: 0, max: 480 },
    { name: 'small', min: 481, max: 768 },
    { name: 'medium', min: 769, max: 1024 },
    { name: 'large', min: 1025, max: 1200 },
    { name: 'xlarge', min: 1201, max: 10000 }
];

export const useBreakpoints = (customBreakpoints: BreakpointParams[] = []): IViewport => {
    const dispatch = useDispatch();
    
    const currentDefaultSize = useSelector((state: RootState) => state.viewport.viewportSize);
    const currentCustomSize = useSelector((state: RootState) => state.viewport.customViewportSize);

    const defaultQueries = defaultBreakpoints.map((bp) => {
        const min = bp.min ?? 0;
        const max = bp.max ?? 1_000_000;
        return {
            name: bp.name,
            mq: useMediaQuery(`(min-width: ${min}px) and (max-width: ${max}px)`)
        };
    });

    const customQueries = customBreakpoints.map((bp) => {
        const min = bp.min ?? 0;
        const max = bp.max ?? 1_000_000;
        return {
            name: bp.name,
            mq: useMediaQuery(`(min-width: ${min}px) and (max-width: ${max}px)`)
        };
    });

    useEffect(() => {
        for (let i = 0; i < defaultQueries.length; i++) {
            if (defaultQueries[i].mq) {
                dispatch(setViewportSize(defaultQueries[i].name));
                break;
            }
        }

        for (let i = 0; i < customQueries.length; i++) {
            if (customQueries[i].mq) {
                dispatch(setCustomViewportSize(customQueries[i].name));
                break;
            }
        }
    }, [defaultQueries, customQueries, dispatch]);

    const isSmallerThan = (testSize: DefaultBreakpoint): boolean => {
        const acutalSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === currentDefaultSize);
        const testSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === testSize);

        return acutalSizeIndex < testSizeIndex;
    };

    const isLargerThan = (testSize: DefaultBreakpoint): boolean => {
        const acutalSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === currentDefaultSize);
        const testSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === testSize);

        return acutalSizeIndex > testSizeIndex;
    };

    const getCurrentSize = (): string => {
        const currentSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === currentDefaultSize);
        return defaultBreakpoints[currentSizeIndex].name;
    };

    const getCurrentCustomSize = (): string => {
        const currentSizeIndex = customBreakpoints.findIndex((bp) => bp.name === currentCustomSize);
        return customBreakpoints[currentSizeIndex].name;
    };

    const viewport: IViewport = {
        current: {
            isXLarge: currentDefaultSize === 'xlarge',
            isLarge: currentDefaultSize === 'large',
            isMedium: currentDefaultSize === 'medium',
            isSmall: currentDefaultSize === 'small',
            isMobile: currentDefaultSize === 'mobile',
        },
        isSmallerThan,
        isLargerThan,
        getCurrentSize,
        getCurrentCustomSize
    };

    customQueries.forEach((query) => {
        viewport.current['is' + query.name[0].toUpperCase() + query.name.slice(1)] = currentCustomSize === query.name;
    });

    return viewport;
};
