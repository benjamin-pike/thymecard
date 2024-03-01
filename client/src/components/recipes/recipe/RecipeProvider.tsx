import { createContext, useContext, FC, ReactElement, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useRecipeDraft from '@/hooks/recipes/useRecipeDraft';
import { useMount } from '@/hooks/common/useMount';
import { ModalState, useModal } from '@/hooks/common/useModal';
import { useRecipeAPI } from '@/api/useRecipeAPI';
import useRecipeComponents from '@/hooks/recipes/useRecipeDraft';

import { Client, IRecipe, IRecipeCreate, IRecipeSummary, IRecipeUpdate, isDefined, isString } from '@thymecard/types';
import { createToast } from '@/lib/toast/toast.utils';
import { buildRecipeImageUrl } from '@/lib/s3/s3.utils';
import { imageUrlToBlob } from '@/lib/media.utils';

type RecipeComponents = ReturnType<typeof useRecipeComponents>['components'];

interface IRecipeContext extends RecipeComponents {
    recipe: Partial<Client<IRecipe>> | undefined;
    summaries: Client<IRecipeSummary>[] | undefined;
    recipeModalState: ModalState;
    isEditing: boolean;
    isIncomplete: boolean;
    selectRecipe: (recipeId: string) => void;
    clearRecipe: () => void;
    handleCreateRecipe: (recipe: Client<IRecipeCreate>, image: Blob | string) => Promise<Client<IRecipe>>;
    handleUpdateRecipe: (update: Client<IRecipeUpdate>) => void;
    handleDeleteRecipe: () => Promise<void>;
    handleParseRecipe: (url: string) => void;
    handleManualCreate: () => void;
    handleSaveRecipe: () => void;
    handleCancelEdit: () => void;
    toggleEditing: () => void;
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
    const navigate = useNavigate();

    const { createRecipe, getRecipe, updateRecipe, deleteRecipe, parseRecipe, getSummaries } = useRecipeAPI();
    const { components, init, validateUpdateResource, validateCreateResource } = useRecipeDraft();

    const { modalState: recipeModalState, openModal: openRecipeModal, closeModal: closeRecipeModal } = useModal();

    const [recipeId, setRecipeId] = useState<string>();
    const [recipe, setRecipe] = useState<Partial<Client<IRecipe>>>();
    const [summaries, setSummaries] = useState<Client<IRecipeSummary>[]>();
    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [isIncomplete, setIsIncomplete] = useState(false);

    const toggleEditing = useCallback(() => {
        setIsEditing(!isEditing);
    }, [isEditing]);

    const selectRecipe = useCallback(
        (recipeId: string) => {
            setRecipeId(recipeId);
        },
        [setRecipeId]
    );

    const enterCreateMode = useCallback(() => {
        openRecipeModal();
        setIsEditing(true);
        navigate('/recipes/create');
    }, [navigate, openRecipeModal]);

    const reset = useCallback(() => {
        setRecipe(undefined);
        setRecipeId(undefined);
        setIsEditing(false);
        setIsIncomplete(false);
    }, []);

    const clearRecipe = useCallback(async () => {
        await closeRecipeModal();

        reset();

        navigate('/recipes');
    }, [closeRecipeModal, navigate, reset]);

    const create = useCallback(async () => {
        const payload = validateCreateResource();

        const { value: image } = components.image.validate();

        if (!image) {
            setIsIncomplete(true);
            throw new Error('An image is required');
        }

        const recipe = await createRecipe(payload, image);

        return recipe;
    }, [components.image, createRecipe, validateCreateResource]);

    const update = useCallback(
        async (recipeId: string) => {
            const payload = validateUpdateResource();

            const { value: image, isModified: isImageModified } = components.image.validate();
            const imageUpdate = image && isImageModified ? image : undefined;

            const recipe = await updateRecipe(recipeId, payload, imageUpdate);

            return recipe;
        },
        [components.image, updateRecipe, validateUpdateResource]
    );

    const refreshSummaries = useCallback(async () => {
        const summaries = await getSummaries();

        setSummaries(summaries);
    }, [getSummaries]);

    const handleCreateRecipe = useCallback(
        async (recipe: Client<IRecipeCreate>, image: Blob | string) => {
            let imageBlob = image;

            if (isString(imageBlob)) {
                imageBlob = await imageUrlToBlob(imageBlob);
            }

            const newRecipe = await createRecipe(recipe, imageBlob);

            refreshSummaries();

            return newRecipe;
        },
        [createRecipe, refreshSummaries]
    );

    const handleUpdateRecipe = useCallback(
        (update: Client<IRecipeUpdate>) => {
            if (!recipeId) {
                return;
            }

            updateRecipe(recipeId, update);
        },
        [recipeId, updateRecipe]
    );

    const handleDeleteRecipe = useCallback(async () => {
        if (!recipeId) {
            return;
        }

        await deleteRecipe(recipeId);

        try {
            await refreshSummaries();
        } catch (e) {
            createToast('error', 'Failed to to fetch your recipes');
        }
    }, [deleteRecipe, recipeId, refreshSummaries]);

    const handleParseRecipe = useCallback(
        async (url: string) => {
            const { recipe, image } = await parseRecipe(url);

            init(recipe, image ?? null);
            setRecipe(recipe);

            enterCreateMode();
        },
        [enterCreateMode, init, parseRecipe]
    );

    const handleManualCreate = useCallback(() => {
        init({}, null);
        setRecipe({});

        enterCreateMode();
    }, [enterCreateMode, init]);

    const handleSaveRecipe = useCallback(async () => {
        const isNew = !isDefined(recipeId);

        try {
            const recipe = isNew ? await create() : await update(recipeId);

            setRecipe(recipe);

            toggleEditing();

            createToast('success', `Recipe ${isNew ? 'created' : 'saved'} successfully`);
        } catch (e) {
            createToast('error', `Failed to ${isNew ? 'create' : 'save'} recipe`);
        }

        try {
            await refreshSummaries();
        } catch (e) {
            createToast('error', 'Failed to to fetch your recipes');
        }
    }, [recipeId, create, update, toggleEditing, refreshSummaries]);

    const handleCancelEdit = useCallback(() => {
        if (recipeId) {
            toggleEditing();
            init(recipe ?? {}, recipe?.image ?? null);
        }

        if (!recipeId) {
            clearRecipe();
        }
    }, [clearRecipe, init, recipe, recipeId, toggleEditing]);

    const handleGetSummaries = useCallback(async () => {
        const summaries = await getSummaries();

        setSummaries(summaries);
    }, [getSummaries]);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId || isLoading || recipeId === recipe?._id) {
                return;
            }

            setIsLoading(true);

            openRecipeModal();

            const r = await getRecipe(recipeId);

            navigate(`/recipes/${recipeId}`);

            init(r, buildRecipeImageUrl(r.image));
            setRecipe(r);

            setIsLoading(false);
        };

        if (recipeId) {
            fetchRecipe();
        }
    }, [getRecipe, init, isLoading, navigate, recipe, recipeId]);

    useMount(() => {
        const fetchSummaries = async () => {
            const summaries = await getSummaries();

            setSummaries(summaries);
        };

        fetchSummaries();
    });

    const value = {
        ...components,
        recipe,
        summaries,
        recipeModalState,
        isEditing,
        isIncomplete,
        selectRecipe,
        clearRecipe,
        handleCreateRecipe,
        handleUpdateRecipe,
        handleDeleteRecipe,
        handleParseRecipe,
        handleManualCreate,
        handleSaveRecipe,
        handleCancelEdit,
        handleGetSummaries,
        toggleEditing
    };

    return <Provider value={value}>{children}</Provider>;
};

export default RecipeProvider;
