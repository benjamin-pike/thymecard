import { Dispatch, FC, ReactElement, useCallback, useState } from 'react';
import { Duration } from 'luxon';
import { useClickOutside } from '@mantine/hooks';

import Accordion from './Accordion';

import { FilterAction, FilterActionType, IFilterState, SortByVariable } from './filter.types';
import { debounce } from '@/lib/common.utils';
import { capitalize } from '@/lib/string.utils';
import { formatMaxTime } from './filter.functions';
import { ICONS } from '@/assets/icons';

import styles from './filter.module.scss';

const FilterIcon = ICONS.recipes.filter;

interface IFilterProps {
    state: IFilterState;
    dispatch: Dispatch<FilterAction>;
}

const Filter: FC<IFilterProps> = ({ state, dispatch }) => {
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => open && setOpen(false));

    const formattedMaxTime = formatMaxTime(state.maxTime);

    const values: Record<string, { primary: string; sup?: string }[]> = {
        sortBy: [{ primary: SORT_BY_MAP[state.sortBy.variable], sup: state.sortBy.sort === 1 ? 'Ascending' : 'Descending' }],
        minRating: [{ primary: state.minRating.toString() }],
        bookmarked: [{ primary: state.bookmarked === 'both' ? 'No Preference' : capitalize(state.bookmarked) }],
        maxTime: [{ primary: formattedMaxTime === 255 ? 'None' : Duration.fromObject({ minutes: formattedMaxTime }).toFormat('h:mm') }]
    };

    const filters = [
        {
            name: 'sortBy',
            title: 'Sort By',
            values: values.sortBy,
            body: <SortBy state={state} dispatch={dispatch} />
        },
        {
            name: 'minRating',
            title: 'Min. Rating',
            values: values.minRating,
            body: <MinRating state={state} dispatch={dispatch} />
        },
        {
            name: 'bookmarked',
            title: 'Bookmarked',
            values: values.bookmarked,
            body: <Bookmarked state={state} dispatch={dispatch} />
        },
        {
            name: 'maxTime',
            title: 'Max. Time',
            values: values.maxTime,
            body: <MaxTime state={state} dispatch={dispatch} />
        }
    ];

    return (
        <section ref={ref} className={styles.filter}>
            <button className={styles.toggleButton} onClick={() => setOpen(!open)}>
                <FilterIcon />
            </button>
            <div className={styles.dialog} data-open={open}>
                <Accordion data={filters} />
            </div>
        </section>
    );
};

export default Filter;

interface IFilterElementProps {
    state: IFilterState;
    dispatch: Dispatch<FilterAction>;
}

const SortBy: FC<IFilterElementProps> = (props) => (
    <div className={styles.sortByWrapper}>
        <SortByRow {...props} variableName="alphabetically" variableTitle="Alphabetically" />
        <SortByRow {...props} variableName="rating" variableTitle="Rating" />
        <SortByRow {...props} variableName="date" variableTitle="Date Added" />
        <SortByRow {...props} variableName="time" variableTitle="Time" />
    </div>
);

const MinRating: FC<IFilterElementProps> = ({ state, dispatch }) => (
    <div className={styles.buttonWrapper}>
        {[0, 1, 2, 3, 4, 5].map((num) => (
            <FilterButton
                key={num}
                dataActive={num === state.minRating}
                onClick={() => dispatch({ type: FilterActionType.SET_MIN_RATING, payload: num })}
            >
                <>{num}</>
            </FilterButton>
        ))}
    </div>
);

const Bookmarked: FC<IFilterElementProps> = ({ state, dispatch }) => (
    <div className={styles.buttonWrapper}>
        {(['yes', 'no', 'both'] as const).map((val) => (
            <FilterButton
                key={val}
                dataActive={state.bookmarked === val}
                onClick={() => dispatch({ type: FilterActionType.SET_BOOKMARKED, payload: val })}
            >
                <>{val === 'both' ? 'No Preference' : capitalize(val)}</>
            </FilterButton>
        ))}
    </div>
);

const MaxTime: FC<IFilterElementProps> = ({ state, dispatch }) => {
    const [localMaxTime, setLocalMaxTime] = useState(state.maxTime);
    const debouncedDispatch = useCallback(debounce(dispatch, 100), [dispatch]);

    return (
        <div className={styles.rangeWrapper}>
            <div className={styles.slider}>
                <div
                    className={styles.overlay}
                    style={{ width: `calc(${(100 * localMaxTime) / 240}% + ${(1 - localMaxTime / 240) * 0.75}rem)` }}
                >
                    <div className={styles.thumb} />
                </div>
                <input
                    type="range"
                    min="0"
                    max="240"
                    onChange={(e) => {
                        setLocalMaxTime(parseInt(e.target.value));
                        debouncedDispatch({ type: FilterActionType.SET_MAX_TIME, payload: parseInt(e.target.value) });
                        return;
                    }}
                />
            </div>
            <div className={styles.times}>
                {[':30', '1:00', ':30', '2:00', ':30', '3:00', ':30', '4:00'].map((time, index) => (
                    <p key={`${time}${index}`}>{time}</p>
                ))}
            </div>
        </div>
    );
};

interface IFilterButtonProps {
    children: ReactElement;
    dataActive: boolean;
    onClick: () => void;
}

const FilterButton: FC<IFilterButtonProps> = ({ children, dataActive, onClick }) => (
    <button className={styles.filterButton} data-active={dataActive} onClick={onClick}>
        {children}
    </button>
);

interface ISortByRowProps {
    state: IFilterState;
    dispatch: Dispatch<FilterAction>;
    variableName: SortByVariable;
    variableTitle: string;
}

const SortByRow: FC<ISortByRowProps> = ({ state, dispatch, variableName, variableTitle }) => (
    <div className={styles.row}>
        <h3>{variableTitle.toLocaleUpperCase()}</h3>
        <div className={styles.order}>
            <FilterButton
                dataActive={state.sortBy.variable === variableName && state.sortBy.sort === 1}
                onClick={() => dispatch({ type: FilterActionType.SET_SORT_BY, payload: { variable: variableName, sort: 1 } })}
            >
                <>{'Ascending'}</>
            </FilterButton>
            <FilterButton
                dataActive={state.sortBy.variable === variableName && state.sortBy.sort === -1}
                onClick={() => dispatch({ type: FilterActionType.SET_SORT_BY, payload: { variable: variableName, sort: -1 } })}
            >
                <>{'Descending'}</>
            </FilterButton>
        </div>
    </div>
);

const SORT_BY_MAP: Record<string, string> = {
    alphabetically: 'Alphabetically',
    rating: 'Rating',
    date: 'Date Added',
    time: 'Time'
};
