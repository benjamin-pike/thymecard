import { Client, IRecipeSummary, isNull } from '@thymecard/types';
import { FilterAction, IFilterState } from './filter.types';

export const filterRecipes = (recipes: Client<IRecipeSummary>[], state: IFilterState): Client<IRecipeSummary>[] => {
    return recipes
        .filter((recipe) => (recipe.rating ?? 0) >= state.minRating)
        .filter((recipe) => {
            if (state.bookmarked === 'yes') return recipe.isBookmarked;
            if (state.bookmarked === 'no') return !recipe.isBookmarked;
            return true;
        })
        .filter((recipe) => {
            if (state.maxTime === 240) return true;

            let totalTime = recipe.totalTime;

            if (!totalTime) {
                totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
            }

            return totalTime <= formatMaxTime(state.maxTime);
        })
        .sort((a, b) => {
            switch (state.sortBy.variable) {
                case 'alphabetically':
                    return a.title.localeCompare(b.title) * state.sortBy.sort;
                case 'date':
                    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * state.sortBy.sort;
                case 'rating':
                    if (isNull(a.rating) && isNull(b.rating)) return 0;
                    if (isNull(a.rating)) return 1;
                    if (isNull(b.rating)) return -1;

                    return (a.rating - b.rating) * state.sortBy.sort;
                case 'time': {
                    let timeA = a.totalTime;
                    let timeB = b.totalTime;

                    if (!timeA) {
                        timeA = a.prepTime && a.cookTime ? a.prepTime + a.cookTime : null;
                    }

                    if (!timeB) {
                        timeB = b.prepTime && b.cookTime ? b.prepTime + b.cookTime : null;
                    }

                    if (isNull(timeA) && isNull(timeB)) return 0;
                    if (isNull(timeA)) return 1;
                    if (isNull(timeB)) return -1;

                    return (timeA - timeB) * state.sortBy.sort;
                }
                default:
                    return 0;
            }
        });
};

export const filterReducer = (state: IFilterState, action: FilterAction): IFilterState => {
    switch (action.type) {
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };
        case 'SET_MIN_RATING':
            return { ...state, minRating: action.payload };
        case 'SET_BOOKMARKED':
            return { ...state, bookmarked: action.payload };
        case 'SET_MAX_TIME':
            return { ...state, maxTime: action.payload };
        default:
            return state;
    }
};

export const formatMaxTime = (maxTime: number): number => {
    return Math.round(maxTime / 15) * 15 + 15;
};
