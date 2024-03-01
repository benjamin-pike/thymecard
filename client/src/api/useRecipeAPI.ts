import { useCallback } from 'react';
import { sendRequest } from '@/lib/api/sendRequest';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from './routes';
import { Client, IRecipe, IRecipeCreate, IRecipeParseResponse, IRecipeSearchResult, IRecipeSummary } from '@thymecard/types';

export const useRecipeAPI = () => {
    const { mutateAsync: callCreateRecipe } = useMutation(async ({ payload }: { payload: FormData }) => {
        const { status, data } = await sendRequest<{ recipe: IRecipe }>(ROUTES.RECIPES.CREATE, 'POST', {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: payload
        });

        if (status !== 201) {
            throw new Error('Failed to create recipe');
        }

        return data;
    });

    const createRecipe = useCallback(
        async (resource: Client<Omit<IRecipeCreate, 'userId'>>, image: Blob) => {
            const payload = new FormData();

            payload.append('data', JSON.stringify(resource));
            payload.append('image', image);

            const { recipe } = await callCreateRecipe({ payload });

            return recipe;
        },
        [callCreateRecipe]
    );

    const { mutateAsync: callGetRecipe } = useMutation(async ({ recipeId }: { recipeId: string }) => {
        const { status, data } = await sendRequest<{ recipe: IRecipe }>(ROUTES.RECIPES.GET, 'GET', {
            params: {
                recipeId
            }
        });

        if (status !== 200) {
            throw new Error('Failed to get recipe');
        }

        return data;
    });

    const getRecipe = useCallback(
        async (recipeId: string) => {
            const { recipe } = await callGetRecipe({ recipeId });

            return recipe;
        },
        [callGetRecipe]
    );

    const { mutateAsync: callUpdateRecipe } = useMutation(async ({ payload, recipeId }: { payload: FormData; recipeId: string }) => {
        const { status, data } = await sendRequest<{ recipe: IRecipe }>(ROUTES.RECIPES.UPDATE, 'PUT', {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                recipeId
            },
            body: payload
        });

        if (status !== 200) {
            throw new Error('Failed to update recipe');
        }

        return data;
    });

    const updateRecipe = useCallback(
        async (recipeId: string, payload: Client<Partial<IRecipe>>, image?: Blob) => {
            const formData = new FormData();

            formData.append('data', JSON.stringify(payload));

            if (image) {
                formData.append('image', image);
            }

            const { recipe } = await callUpdateRecipe({ payload: formData, recipeId });

            return recipe;
        },
        [callUpdateRecipe]
    );

    const { mutateAsync: callDeleteRecipe } = useMutation(async ({ recipeId }: { recipeId: string }) => {
        const { status } = await sendRequest(ROUTES.RECIPES.DELETE, 'DELETE', {
            params: {
                recipeId
            }
        });

        if (status !== 204) {
            throw new Error('Failed to delete the recipe');
        }
    });

    const deleteRecipe = useCallback(
        async (recipeId: string) => {
            await callDeleteRecipe({ recipeId });
        },
        [callDeleteRecipe]
    );

    const { mutateAsync: callParseRecipe } = useMutation(async ({ url }: { url: string }) => {
        const { status, data } = await sendRequest<{ result: IRecipeParseResponse }>('/recipes/parse', 'POST', { body: { url } });

        if (status !== 200) {
            throw new Error('Failed to parse recipe');
        }

        return data;
    });

    const parseRecipe = useCallback(
        async (url: string) => {
            const { result } = await callParseRecipe({ url });

            return result;
        },
        [callParseRecipe]
    );

    const { mutateAsync: callGetSummaries } = useMutation(async () => {
        const { status, data } = await sendRequest<{ summaries: IRecipeSummary[] }>(ROUTES.RECIPES.SUMMARIES, 'GET');

        if (status !== 200) {
            throw new Error('Failed to get summaries');
        }

        return data;
    });

    const getSummaries = useCallback(async () => {
        const { summaries } = await callGetSummaries();

        return summaries;
    }, [callGetSummaries]);

    const { mutateAsync: callSearchRecipes } = useMutation(async ({ query }: { query: string }) => {
        const { status, data } = await sendRequest(ROUTES.RECIPES.SEARCH, 'GET', {
            query: {
                query: encodeURIComponent(query)
            }
        });

        if (status !== 200) {
            throw new Error('Failed to search recipes');
        }

        return data;
    });

    const searchRecipes = useCallback(
        async (query: string) => {
            const { data, page } = await callSearchRecipes({ query });
            const { nextKey } = page;

            return {
                data,
                nextKey
            };
        },
        [callSearchRecipes]
    );

    const { mutateAsync: callSearchGoogleRecipes } = useMutation(async ({ query }: { query: string }) => {
        const { status, data } = await sendRequest<{ results: IRecipeSearchResult[] }>(ROUTES.RECIPES.SEARCH_GOOGLE, 'GET', {
            query: {
                query: encodeURIComponent(query)
            }
        });

        if (status !== 200) {
            throw new Error('Failed to search recipes');
        }

        return data;
    });

    const searchGoogleRecipes = useCallback(
        async (query: string) => {
            const { results } = await callSearchGoogleRecipes({ query });

            return results;
        },
        [callSearchGoogleRecipes]
    );

    return {
        createRecipe,
        getRecipe,
        updateRecipe,
        deleteRecipe,
        parseRecipe,
        getSummaries,
        searchRecipes,
        searchGoogleRecipes
    };
};
