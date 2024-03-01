import { Client, IRecipe, IRecipeSummary } from '@thymecard/types';

export const collateRecipeTags = (recipe: Partial<Client<IRecipe>> | IRecipeSummary): { name: string; type: string }[] => {
    const tags = [
        ...(recipe.cuisine || []).map((tag) => ({ name: tag, type: 'cuisine' })),
        ...(recipe.diet || []).map((tag) => ({ name: tag, type: 'diet' })),
        ...(recipe.category || []).map((tag) => ({ name: tag, type: 'category' }))
    ];

    const added = new Set<string>();

    const uniqueTags = tags.filter((tag) => {
        if (!added.has(tag.name)) {
            added.add(tag.name);
            return true;
        }
        return false;
    });

    return uniqueTags;
};
