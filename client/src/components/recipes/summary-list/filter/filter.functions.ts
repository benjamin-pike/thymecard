import { IRecipeSummary } from '@thymecard/types';
import { FilterAction, IFilterState } from './filter.types';
import { isDefined } from '@/lib/type.utils';

export const filterRecipes = (recipes: IRecipeSummary[], state: IFilterState): IRecipeSummary[] => {
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
                    if (!isDefined(a.rating) && !isDefined(b.rating)) return 0;
                    if (!isDefined(a.rating)) return 1;
                    if (!isDefined(b.rating)) return -1;

                    return (a.rating - b.rating) * state.sortBy.sort;
                case 'time': {
                    let timeA = a.totalTime;
                    let timeB = b.totalTime;

                    if (!timeA) {
                        timeA = a.prepTime && a.cookTime ? a.prepTime + a.cookTime : undefined;
                    }

                    if (!timeB) {
                        timeB = b.prepTime && b.cookTime ? b.prepTime + b.cookTime : undefined;
                    }

                    if (!isDefined(timeA) && !isDefined(timeB)) return 0;
                    if (!isDefined(timeA)) return 1;
                    if (!isDefined(timeB)) return -1;

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
