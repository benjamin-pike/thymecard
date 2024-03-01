import { FC, useCallback, useState } from 'react';
import QuickSearch from '../QuickSearch';
import MealEventBookmarkSearchResult from './MealEventBookmarkSearchResult';
import { usePlanAPI } from '@/api/usePlanAPI';
import { QuickSearchState } from '@/hooks/common/useQuickSearch';
import { Client, IMealEventBookmark } from '@thymecard/types';
import styles from './meal-event-bookmark-quick-search.module.scss';

interface IEventBookmarkQuickSearchProps {
    state: QuickSearchState;
    handleSelectResult: (bookmark: Client<IMealEventBookmark>) => void;
    handleClose: () => void;
}

const EventBookmarkQuickSearch: FC<IEventBookmarkQuickSearchProps> = ({ state, handleSelectResult, handleClose }) => {
    const { searchMealEventBookmarks, getMealEventBookmarks } = usePlanAPI();

    const [results, setResults] = useState<Client<IMealEventBookmark>[]>([]);

    const handleSearch = useCallback(
        async (query: string) => {
            const { data } = await searchMealEventBookmarks(query);

            setResults(data);
        },
        [searchMealEventBookmarks]
    );

    const handleClearResults = useCallback(() => {
        setResults([]);
    }, [setResults]);

    const handleGetInitialState = useCallback(async () => {
        const { data } = await getMealEventBookmarks();

        setResults(data);
    }, [getMealEventBookmarks]);

    return (
        <QuickSearch
            placeholder="Search for bookmarked events"
            state={state}
            blurBackground={true}
            handleSearch={handleSearch}
            handleGetInitialState={handleGetInitialState}
            handleClearResults={handleClearResults}
            handleClose={handleClose}
        >
            <>
                {!!results.length && (
                    <>
                        <div className={styles.divider} />
                        <ul className={styles.results}>
                            {results.map((result) => (
                                <MealEventBookmarkSearchResult
                                    key={result._id}
                                    result={result}
                                    handleSelectResult={handleSelectResult}
                                    handleCloseSearch={handleClose}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </>
        </QuickSearch>
    );
};

export default EventBookmarkQuickSearch;
