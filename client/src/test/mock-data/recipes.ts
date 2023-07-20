import { srngFloat, srngInt } from '@/lib/random.utils';
import { RECIPES, TAGS } from './data/recipes';
import { IRecipe } from '@/types/recipe.types';
import RECIPE_IMAGES from './data/recipe-images.json';
import { DateTime } from 'luxon';

const IMAGES: Record<string, string[]> = RECIPE_IMAGES;

export const generateMockRecipeList = (): IRecipe[] => {
    const recipeNames = RECIPES.map((recipe) => recipe.name).sort((a, b) => 0.5 - srngFloat([a, b]));

    return recipeNames.map(generateRecipeEntry);
};

const generateRecipeEntry = (name: string): IRecipe => {
    const imageCandidates = IMAGES[name];
    const tagCandidates = TAGS[name] ?? [];
    const minutesInYear = 60 * 24 * 365;

    const imageUrl = imageCandidates[srngInt(0, imageCandidates.length - 1, [name, 'image'])];
    const servings = srngInt(1, 6, [name, 'servings']) * 2;
    const prepTime = srngInt(2, 20, [name, 'prepTime']) * 5;
    const cookTime = srngInt(2, 20, [name, 'cookTime']) * 5;
    const rating = srngInt(1, 10, [name, 'rating']) / 2;
    const tags = tagCandidates.slice(0, srngInt(2, 5, [name, 'tags']));
    const bookmarked = srngFloat([name, 'bookmarked']) > 0.5;
    const dateAdded = DateTime.local()
        .minus({ minutes: srngInt(0, minutesInYear, [name, 'dateAdded']) })
        .toJSDate();

    return {
        name,
        imageUrl,
        servings,
        prepTime,
        cookTime,
        rating,
        bookmarked,
        dateAdded,
        tags
    };
};