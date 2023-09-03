import { IRecipe } from "@/types/recipe.types";
import { FilterAction, IFilterState } from "./filter.types";
import { isDefined } from "@/lib/type.utils";

export const filterRecipes = (recipes: IRecipe[], state: IFilterState): IRecipe[] => {
    return recipes
        .filter((recipe) => (recipe.rating ?? 5) >= state.minRating)
        .filter((recipe) => {
            if (state.bookmarked === 'yes') return recipe.bookmarked;
            if (state.bookmarked === 'no') return !recipe.bookmarked;
            return true;
        })
        .filter((recipe) => {
            if (state.maxTime === 255) return true;
            return (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) <= formatMaxTime(state.maxTime);
        })
        .sort((a, b) => {
            switch (state.sortBy.variable) {
                case 'alphabetically':
                    return a.name.localeCompare(b.name) * state.sortBy.sort;
                case 'date':
                    return (a.dateAdded.getTime() - b.dateAdded.getTime()) * state.sortBy.sort;
                case 'rating':
                    if (!isDefined(a.rating) && !isDefined(b.rating)) return 0;
                    if (!isDefined(a.rating)) return 1;
                    if (!isDefined(b.rating)) return -1;

                    return (a.rating - b.rating) * state.sortBy.sort;
                case 'time':
                    const timeA = a.prepTime && a.cookTime ? a.prepTime + a.cookTime : Infinity;
                    const timeB = b.prepTime && b.cookTime ? b.prepTime + b.cookTime : Infinity;

                    if (timeA === Infinity && timeB === Infinity) return 0;
                    if (timeA === Infinity) return 1;
                    if (timeB === Infinity) return -1;

                    return (timeA - timeB) * state.sortBy.sort;
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
