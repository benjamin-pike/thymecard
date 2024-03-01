import { FC, useCallback } from 'react';

import RecipeQuickSearch from '@/components/quick-search/recipe/RecipeQuickSearch';

import { usePlan } from './PlanProvider';
import { useQuickSearch } from '@/hooks/common/useQuickSearch';

import { createToast } from '@/lib/toast/toast.utils';
import { Client, IMealEventItem, IRecipe, isDefined } from '@thymecard/types';
import { ICONS } from '@/assets/icons';

import styles from './event-item.module.scss';

const RecipeIcon = ICONS.common.recipe;
const RecipeIconFill = ICONS.common.recipeFill;
const FavoriteIcon = ICONS.common.star;
const FavoriteIconFill = ICONS.common.starFill;

interface IEventItemProps extends IMealEventItem {
    handleSelectRecipe: (recipeId: string) => void;
    handleSelectEventItem: () => void;
}

const EventItem: FC<IEventItemProps> = ({ name, isFavorite, recipeId, handleSelectRecipe, handleSelectEventItem }) => {
    const { handleUpdateMealEventItem } = usePlan();
    const hasLinkedRecipe = isDefined(recipeId);
    const { quickSearchState, isQuickSearchClosed, toggleQuickSearchState } = useQuickSearch();

    const handleToggleQuickSearch = useCallback(() => {
        handleSelectEventItem();
        if (hasLinkedRecipe) {
            handleSelectRecipe(recipeId);
        } else {
            toggleQuickSearchState();
        }
    }, [handleSelectEventItem, handleSelectRecipe, hasLinkedRecipe, recipeId, toggleQuickSearchState]);

    const handleLinkRecipe = useCallback(
        (recipe: Client<IRecipe>) => {
            try {
                handleUpdateMealEventItem({
                    recipeId: recipe._id,
                    name: recipe.title,
                    calories: recipe.nutrition?.calories,
                    servings: 1
                });
            } catch (error: any) {
                createToast('error', error.message ?? 'Oops, something went wrong, please try again later.');
            }
        },
        [handleUpdateMealEventItem]
    );

    return (
        <>
            <li className={styles.item}>
                <p>{name}</p>
                <div className={styles.buttons}>
                    <button
                        className={styles.favoriteMealItem}
                        data-active={!!isFavorite}
                        data-tooltip-id="favorite-meal-item"
                        data-tooltip-content={`${isFavorite ? 'Remove From' : 'Add to'} Favorites`}
                    >
                        <FavoriteIcon />
                        <FavoriteIconFill />
                    </button>
                    <button
                        className={styles.linkToRecipe}
                        data-active={isDefined(recipeId)}
                        data-tooltip-id={'link-to-recipe'}
                        data-tooltip-content={hasLinkedRecipe ? 'View Linked Recipe' : 'Link to Recipe'}
                        onClick={handleToggleQuickSearch}
                    >
                        <RecipeIcon />
                        <RecipeIconFill />
                    </button>
                </div>
            </li>
            <RecipeQuickSearch
                key={isQuickSearchClosed.toString()}
                state={quickSearchState}
                handleSelectResult={handleLinkRecipe}
                handleClose={handleToggleQuickSearch}
            />
        </>
    );
};

export default EventItem;
