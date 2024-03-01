import { useCallback, useMemo } from 'react';

import useAuthors from './components/useAuthors';
import useComments from './components/useComments';
import useDescription from './components/useDescription';
import useImage from './components/useImage';
import useIngredients from './components/useIngredients';
import useLastCooked from './components/useLastCooked';
import useMethod from './components/useMethod';
import useNutrition from './components/useNutrition';
import useRating from './components/useRating';
import useSource from './components/useSource';
import useTags from './components/useTags';
import useTime from './components/useTime';
import useTitle from './components/useTitle';
import useYield from './components/useYield';

import { Client, IRecipe, IRecipeCreate, IRecipeUpdate } from '@thymecard/types';

const useRecipeDraft = () => {
    const title = useTitle();
    const description = useDescription();
    const authors = useAuthors();
    const source = useSource();
    const recipeYield = useYield(); // yield is a reserved keyword
    const time = useTime();
    const rating = useRating();
    const lastCooked = useLastCooked();
    const tags = useTags();
    const nutrition = useNutrition();
    const ingredients = useIngredients();
    const method = useMethod();
    const comments = useComments();
    const image = useImage();

    const components = useMemo(
        () => ({
            title,
            description,
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
            image
        }),
        [title, description, authors, source, recipeYield, time, rating, lastCooked, tags, nutrition, ingredients, method, comments, image]
    );

    const init = useCallback(
        (recipe: Partial<Client<IRecipe>>, image: string | null) => {
            components.title.init(recipe.title);
            components.description.init(recipe.description);
            components.authors.init(recipe.authors);
            components.source.init(recipe.source);
            components.recipeYield.init(recipe.yield);
            components.time.init(recipe.prepTime, recipe.cookTime, recipe.totalTime);
            components.rating.init(recipe.rating);
            components.lastCooked.init(recipe.lastCooked);
            components.tags.init(recipe.cuisine, recipe.diet, recipe.category);
            components.nutrition.init(recipe.nutrition);
            components.ingredients.init(recipe.ingredients);
            components.method.init(recipe.method);
            components.comments.init(recipe.comments);

            components.image.init(image);
        },
        [components]
    );

    const validateComponents = useCallback(() => {
        const { cuisine, diet, category } = components.tags.validate();
        const { prep: prepTime, cook: cookTime, total: totalTime } = components.time.validate();

        return {
            title: components.title.validate(),
            description: components.description.validate(),
            authors: components.authors.validate(),
            source: components.source.validate(),
            yield: components.recipeYield.validate(),
            cuisine,
            diet,
            category,
            prepTime,
            cookTime,
            totalTime,
            rating: components.rating.validate(),
            lastCooked: components.lastCooked.validate(),
            nutrition: components.nutrition.validate(),
            ingredients: components.ingredients.validate(),
            method: components.method.validate(),
            comments: components.comments.validate()
        };
    }, [components]);

    const validateCreateResource = useCallback((): Client<Omit<IRecipeCreate, 'userId'>> => {
        const _ = validateComponents();

        return {
            title: _.title.value,
            description: _.description.value,
            authors: _.authors.value,
            source: _.source.value,
            yield: _.yield.value,
            prepTime: _.prepTime.value,
            cookTime: _.cookTime.value,
            totalTime: _.totalTime.value,
            rating: _.rating.value,
            lastCooked: _.lastCooked.value,
            cuisine: _.cuisine.value,
            diet: _.diet.value,
            category: _.category.value,
            nutrition: _.nutrition.value,
            ingredients: _.ingredients.value,
            method: _.method.value,
            comments: _.comments.value
        };
    }, [validateComponents]);

    const validateUpdateResource = useCallback((): Client<IRecipeUpdate> => {
        const _ = validateComponents();

        const payload: Client<IRecipeUpdate> = {
            title: _.title.isModified ? _.title.value : undefined,
            description: _.description.isModified ? _.description.value : undefined,
            authors: _.authors.isModified ? _.authors.value : undefined,
            source: _.source.isModified ? _.source.value : undefined,
            yield: _.yield.isModified ? _.yield.value : undefined,
            prepTime: _.prepTime.isModified ? _.prepTime.value : undefined,
            cookTime: _.cookTime.isModified ? _.cookTime.value : undefined,
            totalTime: _.totalTime.isModified ? _.totalTime.value : undefined,
            rating: _.rating.isModified ? _.rating.value : undefined,
            lastCooked: _.lastCooked.isModified ? _.lastCooked.value : undefined,
            cuisine: _.cuisine.isModified ? _.cuisine.value : undefined,
            diet: _.diet.isModified ? _.diet.value : undefined,
            category: _.category.isModified ? _.category.value : undefined,
            nutrition: _.nutrition.isModified ? _.nutrition.value : undefined,
            ingredients: _.ingredients.isModified ? _.ingredients.value : undefined,
            method: _.method.isModified ? _.method.value : undefined,
            comments: _.comments.isModified ? _.comments.value : undefined
        };

        return payload;
    }, [validateComponents]);

    return { components, init, validateCreateResource, validateUpdateResource };
};

export default useRecipeDraft;
