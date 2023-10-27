import { Client, IRecipe, IRecipeSummary } from '@sirona/types';

export const collateRecipeTags = (recipe: Partial<Client<IRecipe>> | IRecipeSummary): string[] => {
    const tags = [...(recipe.cuisine || []), ...(recipe.diet || []), ...(recipe.category || [])];
    return [...new Set(tags)];
};
