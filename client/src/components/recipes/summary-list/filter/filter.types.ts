export type SortByVariable = 'alphabetically' | 'rating' | 'date' | 'time';

export interface IFilterState {
    sortBy: {
        variable: SortByVariable;
        sort: 1 | -1;
    };
    minRating: number;
    bookmarked: 'yes' | 'no' | 'both';
    maxTime: number;
}

export type FilterAction =
    | { type: 'SET_SORT_BY'; payload: IFilterState['sortBy'] }
    | { type: 'SET_MIN_RATING'; payload: number }
    | { type: 'SET_BOOKMARKED'; payload: IFilterState['bookmarked'] }
    | { type: 'SET_MAX_TIME'; payload: number };

export enum FilterActionType {
    SET_SORT_BY = 'SET_SORT_BY',
    SET_MIN_RATING = 'SET_MIN_RATING',
    SET_BOOKMARKED = 'SET_BOOKMARKED',
    SET_MAX_TIME = 'SET_MAX_TIME'
}
