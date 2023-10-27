import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setViewportSize, setCustomViewportSize } from '@/store/slices/viewport';

type DefaultBreakpoint = 'mobile' | 'small' | 'medium' | 'large' | 'xlarge';

interface BreakpointParams<T = string> {
    name: T;
    min?: number;
    max?: number;
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
    getCurrentSize: () => string | null;
    getCurrentCustomSize: () => string | null;
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
    const provider = document.querySelector('.responsive-wrapper');
    const breakpoints = useMemo(() => [...defaultBreakpoints, ...customBreakpoints], [customBreakpoints]);

    const [matchedQueries, setMatchedQueries] = useState<string[]>([]);

    useEffect(() => {
        const mediaListeners: { mq: MediaQueryList; listener: () => void }[] = [];

        breakpoints.forEach((bp) => {
            const min = bp.min ?? 0;
            const max = bp.max ?? 1_000_000;
            const mq = window.matchMedia(`(min-width: ${min}px) and (max-width: ${max}px)`);

            const listener = () => {
                const isMatched = mq.matches;
                setMatchedQueries((prev) => {
                    if (isMatched && !prev.includes(bp.name)) {
                        return [...prev, bp.name];
                    } else if (!isMatched && prev.includes(bp.name)) {
                        return prev.filter((q) => q !== bp.name);
                    }
                    return prev;
                });
            };

            mq.addListener(listener);
            mediaListeners.push({ mq, listener });

            listener();
        });

        return () => {
            mediaListeners.forEach(({ mq, listener }) => {
                mq.removeListener(listener);
            });
        };
    }, [breakpoints]);

    useEffect(() => {
        const defaultSize = matchedQueries.find((q) => defaultBreakpoints.some((bp) => bp.name === q));
        if (defaultSize) {
            dispatch(setViewportSize(defaultSize));
            if (provider) {
                provider.setAttribute('data-viewport', defaultSize);
            }
        }
    }, [matchedQueries, dispatch, provider]);

    useEffect(() => {
        const customSize = matchedQueries.find((q) => customBreakpoints.some((bp) => bp.name === q));
        if (customSize) {
            dispatch(setCustomViewportSize(customSize));
            if (provider) {
                provider.setAttribute('data-custom-viewport', customSize);
            }
        }
    }, [matchedQueries, dispatch, provider, customBreakpoints]);

    const isSmallerThan = (testSize: DefaultBreakpoint): boolean => {
        const actualSizeIndex = defaultBreakpoints.findIndex((bp) => matchedQueries.includes(bp.name));
        const testSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === testSize);

        return actualSizeIndex < testSizeIndex;
    };

    const isLargerThan = (testSize: DefaultBreakpoint): boolean => {
        const actualSizeIndex = defaultBreakpoints.findIndex((bp) => matchedQueries.includes(bp.name));
        const testSizeIndex = defaultBreakpoints.findIndex((bp) => bp.name === testSize);

        return actualSizeIndex > testSizeIndex;
    };

    const getCurrentSize = (): string | null => {
        for (const query of matchedQueries) {
            if (defaultBreakpoints.some((bp) => bp.name === query)) {
                return query;
            }
        }
        return null;
    };

    const getCurrentCustomSize = (): string | null => {
        for (const query of matchedQueries) {
            if (customBreakpoints.some((bp) => bp.name === query)) {
                return query;
            }
        }
        return null;
    };

    const viewport: IViewport = {
        current: {
            isXLarge: matchedQueries.includes('xlarge'),
            isLarge: matchedQueries.includes('large'),
            isMedium: matchedQueries.includes('medium'),
            isSmall: matchedQueries.includes('small'),
            isMobile: matchedQueries.includes('mobile'),
            ...Object.fromEntries(matchedQueries.map((query) => [`is${query[0].toUpperCase() + query.slice(1)}`, true]))
        },
        isSmallerThan,
        isLargerThan,
        getCurrentSize,
        getCurrentCustomSize
    };

    return viewport;
};
