import { FC, ReactElement, useCallback, useEffect, useState } from 'react';

import Tooltip from '../common/tooltip/Tooltip';
import QuickSearchWrapper from '@/components/wrappers/search/QuickSearchWrapper';
import LoadingSpinner from '../common/loading-spinner/LoadingSpinner';

import { useDebounce } from '@/hooks/common/useDebounce';
import { QuickSearchState } from '@/hooks/common/useQuickSearch';

import { ICONS } from '@/assets/icons';
import { isDefined } from '@thymecard/types';

import styles from './quick-search.module.scss';

const SearchIcon = ICONS.common.search;

export interface IQuickSearchProps {
    children: ReactElement;
    placeholder: string;
    state: QuickSearchState;
    blurBackground: boolean;
    buttonIcon?: ReactElement;
    buttonTooltipId?: string;
    buttonTooltipContent?: string;
    handleSearch: (query: string) => Promise<void>;
    handleGetInitialState?: () => Promise<void>;
    handleClearResults: () => void;
    handleClose: () => void;
    handleButtonAction?: (query: string) => Promise<void>;
}

const QuickSearch: FC<IQuickSearchProps> = ({
    children,
    state,
    blurBackground,
    placeholder,
    buttonIcon,
    buttonTooltipId,
    buttonTooltipContent,
    handleSearch,
    handleGetInitialState,
    handleClearResults,
    handleClose,
    handleButtonAction
}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const [hasAttemptedInitialSearch, setHasAttemptedInitialSearch] = useState(false);

    const debouncedSearch = useDebounce(async (query: string) => {
        setIsSearching(true);

        handleSearch(query);

        setIsSearching(false);
    }, 150);

    const handleSeachChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setSearchValue(value);

            if (value === '') {
                handleClearResults();
                return;
            }

            if (value.length > 2) {
                debouncedSearch(value);
            }
        },
        [debouncedSearch, handleClearResults]
    );

    const handleButtonClick = useCallback(() => {
        if (!isDefined(handleButtonAction)) {
            return;
        }

        setIsSearching(true);

        handleButtonAction(searchValue);

        setIsSearching(false);
    }, [handleButtonAction, searchValue]);

    useEffect(() => {
        if (state !== 'open' || !isDefined(handleGetInitialState) || hasAttemptedInitialSearch) {
            return;
        }

        setHasAttemptedInitialSearch(true);

        const getInitialState = async () => {
            setIsSearching(true);

            await handleGetInitialState();

            setIsSearching(false);
        };

        getInitialState();
    }, [handleGetInitialState, hasAttemptedInitialSearch, state]);

    return (
        <QuickSearchWrapper state={state} handleCloseModal={handleClose} blurBackground={blurBackground}>
            <>
                <div className={styles.container}>
                    <div className={styles.search}>
                        <SearchIcon className={styles.icon} />
                        <input type="text" value={searchValue} placeholder={placeholder} autoFocus onChange={handleSeachChange} />
                        {isSearching ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            isDefined(buttonIcon) && (
                                <button
                                    className={styles.button}
                                    data-tooltip-id={buttonTooltipId}
                                    data-tooltip-content={buttonTooltipContent}
                                    onClick={handleButtonClick}
                                >
                                    {buttonIcon}
                                </button>
                            )
                        )}
                    </div>
                    {children}
                </div>
                <Tooltip id={buttonTooltipId} place="bottom" size="small" offset={10} />
            </>
        </QuickSearchWrapper>
    );
};

export default QuickSearch;
