import { FC, useState, useMemo, useCallback } from 'react';
import { Duration } from 'luxon';

import LoadingSpinner from '../../common/loading-spinner/LoadingSpinner';

import { useRecipe } from '@/components/food/recipe/RecipeProvider';

import { convertToClientType } from '@/lib/common.utils';
import { createToast } from '@/lib/toast/toast.utils';
import { Client, IRecipe, IRecipeSearchResult, isSavedRecipe } from '@thymecard/types';
import { ICONS } from '@/assets/icons';

import styles from './recipe-search-result.module.scss';

const ServingsIcon = ICONS.recipes.servings;
const PrepTimeIcon = ICONS.recipes.prepTime;
const CookTimeIcon = ICONS.recipes.cookTime;
const TotalTimeIcon = ICONS.recipes.totalTime;
const IngredientsIcon = ICONS.recipes.tickList;
const CaloriesIcon = ICONS.common.pieChart;
const StarIcon = ICONS.common.star;

interface IRecipeSearchResultProps {
    recipe: Client<IRecipe> | Client<IRecipeSearchResult['recipe']>;
    image: string;
    handleSelectResult: (recipe: Client<IRecipe>) => Promise<void> | void;
    handleCloseSearch: () => void;
}

const RecipeSearchResult: FC<IRecipeSearchResultProps> = ({ recipe, image, handleSelectResult, handleCloseSearch }) => {
    const { handleCreateRecipe } = useRecipe();

    const [isLoading, setIsLoading] = useState(false);

    const metadata = useMemo(
        () => [
            {
                name: 'servings',
                label: 'Servings',
                value: recipe.yield.quantity.join(' - ').toString(),
                icon: <ServingsIcon />,
                display: true
            },
            {
                name: 'prepTime',
                label: 'Prep Time',
                value: Duration.fromObject({ minutes: recipe.prepTime }).toFormat('h:mm'),
                icon: <PrepTimeIcon />,
                display: !!recipe.prepTime
            },
            {
                name: 'cookTime',
                label: 'Cook Time',
                value: recipe.cookTime ? Duration.fromObject({ minutes: recipe.cookTime }).toFormat('h:mm') : undefined,
                icon: <CookTimeIcon />,
                display: !!recipe.cookTime
            },
            {
                name: 'totalTime',
                label: 'Total Time',
                value: recipe.totalTime ? Duration.fromObject({ minutes: recipe.totalTime }).toFormat('h:mm') : undefined,
                icon: <TotalTimeIcon />,
                display: !!recipe.totalTime && !((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) === recipe.totalTime)
            },
            {
                name: 'ingredientsCount',
                label: 'Ingredients',
                value: recipe.ingredients.length.toString(),
                icon: <IngredientsIcon />,
                display: true
            },
            {
                name: 'calories',
                label: 'Calories',
                value: recipe?.nutrition?.calories?.toString() + ' kcal',
                icon: <CaloriesIcon />,
                display: !!recipe?.nutrition?.calories
            },
            {
                name: 'rating',
                label: 'Rating',
                value: recipe.rating?.toString(),
                icon: <StarIcon />,
                display: !!recipe.rating
            }
        ],
        [recipe]
    );

    const handleClick = useCallback(async () => {
        let recipeToLink: Client<IRecipe>;

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        if (isSavedRecipe(recipe)) {
            recipeToLink = recipe;
        } else {
            const clientRecipe = convertToClientType(recipe);

            try {
                recipeToLink = await handleCreateRecipe(clientRecipe, image);
            } catch (error: any) {
                createToast('error', error.message ?? 'Oops, something went wrong, please try again later.');
                return;
            }
        }

        await handleSelectResult(recipeToLink);

        setIsLoading(false);

        handleCloseSearch();
    }, [handleCloseSearch, handleCreateRecipe, handleSelectResult, image, isLoading, recipe]);

    return (
        <li key={recipe.title} className={styles.result}>
            <button onClick={handleClick}>
                <div className={styles.image}>
                    <img src={image} />
                </div>
                <div className={styles.details}>
                    <p className={styles.title}>{recipe.title}</p>
                    <ul className={styles.metadata}>
                        {metadata.map((item, i) =>
                            item.display ? (
                                <>
                                    <li key={item.name}>
                                        {item.icon}
                                        <p className={styles.label}>{item.value}</p>
                                    </li>
                                    <div key={i} className={styles.separator} />
                                </>
                            ) : null
                        )}
                    </ul>
                </div>
                {isLoading && <LoadingSpinner size="small" />}
            </button>
        </li>
    );
};

export default RecipeSearchResult;
