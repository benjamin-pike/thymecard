import { createContext, useContext, FC, ReactElement, useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Client,
    IRecipe,
    IRecipeComment,
    IRecipeNutritionalInformation,
    IRecipeUpdate,
    IRecipeYield,
    RecipeIngredients,
    RecipeMethod
} from '@sirona/types';
import { useNavigate } from 'react-router-dom';

import useAuthors from '@/hooks/recipes/useAuthors';
import useDescription from '@/hooks/recipes/useDescription';
import useIngredients from '@/hooks/recipes/useIngredients';
import useLastCooked from '@/hooks/recipes/useLastCooked';
import useMethod from '@/hooks/recipes/useMethod';
import useRating from '@/hooks/recipes/useRating';
import useSource from '@/hooks/recipes/useSource';
import useTags from '@/hooks/recipes/useTags';
import useTime from '@/hooks/recipes/useTime';
import useTitle from '@/hooks/recipes/useTitle';
import useYield from '@/hooks/recipes/useYield';
import useComments from '@/hooks/recipes/useComments';
import useNutrition from '@/hooks/recipes/useNutrition';

import { sendRequest } from '@/lib/api/sendRequest';
import { createToast } from '@/lib/toast/toast.utils';
import useImage from '@/hooks/recipes/useImage';
import { getRecipeImageUrl } from '@/lib/s3/s3.utils';

interface IRecipeContext {
    recipe: Partial<Client<IRecipe>> | undefined;
    renderStatus: 'open' | 'closing' | 'closed';
    isLoading: boolean;
    isError: boolean;
    error: any;
    isEditing: boolean;
    isIncomplete: boolean;
    title: ReturnType<typeof useTitle>;
    description: ReturnType<typeof useDescription>;
    image: ReturnType<typeof useImage>;
    authors: ReturnType<typeof useAuthors>;
    source: ReturnType<typeof useSource>;
    recipeYield: ReturnType<typeof useYield>;
    time: ReturnType<typeof useTime>;
    rating: ReturnType<typeof useRating>;
    tags: ReturnType<typeof useTags>;
    nutrition: ReturnType<typeof useNutrition>;
    lastCooked: ReturnType<typeof useLastCooked>;
    ingredients: ReturnType<typeof useIngredients>;
    method: ReturnType<typeof useMethod>;
    comments: ReturnType<typeof useComments>;
    getRecipe: (recipeId: string) => void;
    clearRecipe: () => void;
    parseRecipe: (url: string) => void;
    createRecipePartial: (recipe: Partial<Client<IRecipe>>) => void;
    upsertRecipe: (payload: Client<IRecipeUpdate>) => Promise<void>;
    deleteRecipe: () => Promise<void>;
    toggleEditing: () => void;
    handleSaveEdit: () => void;
    handleCancelEdit: () => void;
}

const RecipeContext = createContext<IRecipeContext | null>(null);
const { Provider } = RecipeContext;

export const useRecipe = () => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipe must be used within a RecipeProvider');
    }
    return context;
};

interface IRecipeProviderProps {
    children: ReactElement;
}

const RecipeProvider: FC<IRecipeProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [recipeId, setRecipeId] = useState<string | undefined>();
    const [recipe, setRecipe] = useState<Partial<Client<IRecipe>> | undefined>();
    const [renderStatus, setRenderStatus] = useState<'open' | 'closing' | 'closed'>('closed');

    const title = useTitle();
    const description = useDescription();
    const image = useImage();
    const authors = useAuthors();
    const source = useSource();
    const recipeYield = useYield(); // yield is a reserved word
    const time = useTime();
    const rating = useRating();
    const lastCooked = useLastCooked();
    const tags = useTags();
    const nutrition = useNutrition();
    const ingredients = useIngredients();
    const method = useMethod();
    const comments = useComments();

    const [isEditing, setIsEditing] = useState(false);
    const [isIncomplete, setIsIncomplete] = useState(false);

    const init = useCallback(
        (recipe: Partial<Client<IRecipe>>) => {
            title.init(recipe.title);
            description.init(recipe.description);
            authors.init(recipe.authors);
            source.init(recipe.source);
            recipeYield.init(recipe.yield);
            time.init(recipe.prepTime, recipe.cookTime, recipe.totalTime);
            rating.init(recipe.rating);
            lastCooked.init(recipe.lastCooked);
            tags.init(recipe.cuisine, recipe.diet, recipe.category);
            nutrition.init(recipe.nutrition);
            ingredients.init(recipe.ingredients);
            method.init(recipe.method);
            comments.init(recipe.comments);
        },
        [authors, comments, description, ingredients, lastCooked, method, nutrition, rating, recipeYield, source, tags, time, title]
    );

    const initImage = useCallback(
        (url: string) => {
            image.init(url);
        },
        [image]
    );

    const getQuery = useQuery<Client<IRecipe>>(
        ['/recipes/:recipeId', recipeId],
        async ({ queryKey }) => {
            const [, recipeId] = queryKey;
            const { status, data } = await sendRequest(`/api/recipes/${recipeId}`, 'GET');
            if (status !== 200) {
                throw new Error('Failed to fetch the recipe');
            }
            return data.recipe;
        },
        {
            enabled: !!recipeId,
            onSuccess: (recipe) => {
                init(recipe);
                initImage(getRecipeImageUrl(recipe.image));
                setRecipe(recipe);
                setRenderStatus('open');
                navigate(`/recipes/${recipeId}`);
            }
        }
    );

    const getRecipe = useCallback(
        (recipeId: string) => {
            setIsEditing(false);
            setRecipeId(recipeId);
        },
        [setRecipeId]
    );

    const clearRecipe = useCallback(() => {
        setRenderStatus('closing');
        navigate('/recipes');

        setTimeout(() => {
            setRenderStatus('closed');
            setRecipeId(undefined);
            setRecipe(undefined);
            setIsEditing(false);
            setIsIncomplete(false);
        }, 400);
    }, [navigate]);

    const createRecipePartial = useCallback(
        (recipe: Partial<Client<IRecipe>>) => {
            init(recipe);
            setRecipe(recipe);
            setRenderStatus('open');
            setIsEditing(true);
            navigate(`/recipes/create`);
        },
        [init, navigate]
    );

    const parseRecipeMutation = useMutation((url: string) => sendRequest('/api/recipes/parse', 'POST', { body: { url } }));

    const parseRecipe = useCallback(
        (url: string) => {
            parseRecipeMutation.mutate(url, {
                onSuccess: async (data) => {
                    createRecipePartial(data.data.recipe);
                    initImage(data.data.image);
                    createToast('success', 'Recipe parsed successfully');
                },
                onError: () => {
                    createToast('error', 'No recipe found at that URL');
                }
            });
        },
        [createRecipePartial, initImage, parseRecipeMutation]
    );

    const upsertRecipeMutation = useMutation(
        async (payload: FormData) => {
            const url = recipeId ? `/api/recipes/${recipeId}` : '/api/recipes';
            const method = recipeId ? 'PUT' : 'POST';

            const { status, data } = await sendRequest(url, method, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: payload
            });

            if (status !== 200 && status !== 201) {
                throw new Error('Failed to upsert recipe');
            }

            init(data.recipe);

            setRecipe(data.recipe);
            setRecipeId(data.recipe._id);

            navigate(`/recipes/${data.recipe._id}`);

            return data.recipe;
        },
        {
            onSuccess: (recipe) => {
                queryClient.setQueryData(['/recipes/:recipeId', recipe._id], recipe);
                queryClient.invalidateQueries(['/recipes/summary']);
            }
        }
    );

    const upsertRecipe = useCallback(
        async (payload: Client<Partial<IRecipe>>, image?: Blob) => {
            const body = recipeId ? payload : { ...recipe, ...JSON.parse(JSON.stringify(payload)) };

            const formData = new FormData();
            formData.append('data', JSON.stringify(body));
            if (image) {
                formData.append('image', image);
            }

            await upsertRecipeMutation.mutateAsync(formData);
        },
        [recipe, recipeId, upsertRecipeMutation]
    );

    const deleteRecipeMutation = useMutation(
        async () => {
            const { status } = await sendRequest(`/api/recipes/${recipeId}`, 'DELETE');
            if (status !== 204) {
                throw new Error('Failed to delete the recipe');
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['/recipes/:recipeId', recipeId]);
                queryClient.invalidateQueries(['/recipes/summary']);
            }
        }
    );

    const deleteRecipe = async () => {
        await deleteRecipeMutation.mutateAsync();
    };

    const toggleEditing = useCallback(() => {
        setIsEditing(!isEditing);
    }, [isEditing]);

    const handleSaveEdit = useCallback(async () => {
        let titleUpdate: string | undefined;
        let descriptionUpdate: string | undefined;
        let authorsUpdate: string[] | undefined;
        let sourceUpdate: string | undefined;
        let yieldUpdate: IRecipeYield | undefined;
        let cuisineUpdate: string[] | undefined;
        let dietUpdate: string[] | undefined;
        let categoryUpdate: string[] | undefined;
        let prepTimeUpdate: number | undefined;
        let cookTimeUpdate: number | undefined;
        let totalTimeUpdate: number | undefined;
        let ratingUpdate: number | undefined;
        let lastCookedUpdate: string | undefined;
        let nutritionUpdate: Client<IRecipeNutritionalInformation> | undefined;
        let ingredientsUpdate: Client<RecipeIngredients> | undefined;
        let methodUpdate: Client<RecipeMethod> | undefined;
        let commentsUpdate: Client<IRecipeComment[]> | undefined;

        let imageUpdate: Blob | undefined;

        try {
            titleUpdate = (() => {
                const { update, isModified } = title.validate();
                if (!isModified) return;
                return update;
            })();
            descriptionUpdate = (() => {
                const { update, isModified } = description.validate();
                if (!isModified) return;
                return update;
            })();
            authorsUpdate = (() => {
                const { update, isModified } = authors.validate();
                if (!isModified) return;
                return update;
            })();
            sourceUpdate = (() => {
                const { update, isModified } = source.validate();
                if (!isModified) return;
                return update;
            })();
            yieldUpdate = (() => {
                const { update, isModified } = recipeYield.validate();
                if (!isModified) return;
                return update;
            })();
            [cuisineUpdate, dietUpdate, categoryUpdate] = (() => {
                const { cuisine, diet, category } = tags.validate();

                return [cuisine, diet, category].map(({ update, isModified }) => {
                    if (!isModified) return;
                    return update;
                });
            })();
            [prepTimeUpdate, cookTimeUpdate, totalTimeUpdate] = (() => {
                const { prep, cook, total } = time.validate();

                return [prep, cook, total].map(({ update, isModified }) => {
                    if (!isModified) return;
                    return update;
                });
            })();
            ratingUpdate = (() => {
                const { update, isModified } = rating.validate();
                if (!isModified) return;
                return update;
            })();
            lastCookedUpdate = (() => {
                const { update, isModified } = lastCooked.validate();
                if (!isModified) return;
                return update;
            })();
            nutritionUpdate = (() => {
                const { update, isModified } = nutrition.validate();
                if (!isModified) return;
                return update;
            })();
            ingredientsUpdate = (() => {
                const { update, isModified } = ingredients.validate();
                if (!isModified) return;
                return update;
            })();
            methodUpdate = (() => {
                const { update, isModified } = method.validate();
                if (!isModified) return;
                return update;
            })();
            commentsUpdate = (() => {
                const { update, isModified } = comments.validate();
                if (!isModified) return;
                return update;
            })();

            imageUpdate = (() => {
                const { update, isModified } = image.validate();
                if (!isModified && recipeId) return;
                return update;
            })();
        } catch (e) {
            setIsIncomplete(true);
            return;
        }

        try {
            const update = {
                title: titleUpdate,
                description: descriptionUpdate,
                authors: authorsUpdate,
                source: sourceUpdate,
                yield: yieldUpdate,
                cuisine: cuisineUpdate,
                diet: dietUpdate,
                category: categoryUpdate,
                prepTime: prepTimeUpdate,
                cookTime: cookTimeUpdate,
                totalTime: totalTimeUpdate,
                rating: ratingUpdate,
                lastCooked: lastCookedUpdate,
                nutrition: nutritionUpdate,
                ingredients: ingredientsUpdate,
                method: methodUpdate,
                comments: commentsUpdate
            };

            if (recipeId && !Object.values(update).some((value) => value) && !imageUpdate) {
                toggleEditing();
                return;
            }

            await upsertRecipe(update, imageUpdate);

            toggleEditing();
            createToast('success', 'Recipe saved successfully');
        } catch (e) {
            createToast('error', 'Failed to save recipe');
        }
    }, [
        title,
        description,
        image,
        authors,
        source,
        recipeYield,
        tags,
        time,
        rating,
        lastCooked,
        nutrition,
        ingredients,
        method,
        comments,
        recipeId,
        upsertRecipe,
        toggleEditing
    ]);

    const handleCancelEdit = useCallback(() => {
        if (recipeId) {
            toggleEditing();
            init(recipe ?? {});
        }

        if (!recipeId) {
            clearRecipe();
        }
    }, [clearRecipe, init, recipe, recipeId, toggleEditing]);

    const isLoading = getQuery.isLoading || upsertRecipeMutation.isLoading || deleteRecipeMutation.isLoading;
    const isError = getQuery.isError || upsertRecipeMutation.isError || deleteRecipeMutation.isError;
    const error = getQuery.error || upsertRecipeMutation.error || deleteRecipeMutation.error;

    const value = {
        recipe,
        renderStatus,
        isLoading,
        isError,
        error,
        isEditing,
        isIncomplete,
        title,
        description,
        image,
        authors,
        source,
        recipeYield,
        time,
        rating,
        lastCooked,
        tags,
        nutrition,
        ingredients,
        method,
        comments,
        getRecipe,
        clearRecipe,
        createRecipePartial,
        parseRecipe,
        upsertRecipe,
        deleteRecipe,
        toggleEditing,
        handleSaveEdit,
        handleCancelEdit
    };

    return <Provider value={value}>{children}</Provider>;
};

export default RecipeProvider;
