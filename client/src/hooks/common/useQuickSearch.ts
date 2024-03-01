import { useCallback, useState } from 'react';

const CLOSE_QUICK_SEARCH_ANIMATION_DURATION = 200;

export type QuickSearchState = 'open' | 'closing' | 'closed';

export const useQuickSearch = () => {
    const [quickSearchState, setQuickSearchState] = useState<QuickSearchState>('closed');

    const openQuickSearch = useCallback(() => {
        if (quickSearchState === 'open') {
            return;
        }

        setQuickSearchState('open');
    }, [quickSearchState]);

    const closeQuickSearch = useCallback(async () => {
        if (quickSearchState !== 'open') {
            return;
        }

        setQuickSearchState('closing');

        await new Promise((resolve) => setTimeout(resolve, CLOSE_QUICK_SEARCH_ANIMATION_DURATION));

        setQuickSearchState('closed');
    }, [quickSearchState]);

    const toggleQuickSearchState = useCallback(() => {
        if (quickSearchState === 'closed') {
            openQuickSearch();
        } else {
            closeQuickSearch();
        }
    }, [closeQuickSearch, quickSearchState, openQuickSearch]);

    const isQuickSearchOpen = quickSearchState === 'open';
    const isQuickSearchClosed = quickSearchState === 'closed';

    return {
        quickSearchState,
        isQuickSearchOpen,
        isQuickSearchClosed,
        openQuickSearch,
        closeQuickSearch,
        toggleQuickSearchState
    };
};
