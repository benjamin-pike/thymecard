import { FC } from 'react';
import { IEventItem, isDefined } from '@thymecard/types';
import { ICONS } from '@/assets/icons';
import styles from './event-item.module.scss';

const RemoveIcon = ICONS.common.XLarge;
const RecipeIcon = ICONS.common.recipe;
const RecipeIconFill = ICONS.common.recipeFill;
const FavoriteIcon = ICONS.common.star;
const FavoriteIconFill = ICONS.common.starFill;
const EditIcon = ICONS.recipes.create;

interface IEventItemProps extends IEventItem {
    handleSelectRecipe: (recipeId: string) => void;
}

const EventItem: FC<IEventItemProps> = ({ title, isFavorite, recipeId, handleSelectRecipe }) => {
    return (
        <li className={styles.item}>
            <p>{title}</p>
            <div className={styles.mealItemButtons}>
                <button
                    className={styles.favoriteMealItem}
                    data-active={isFavorite}
                    data-tooltip-id="favorite-meal-item"
                    data-tooltip-content={`${isFavorite ? 'Remove From' : 'Add to'} Favorites`}
                >
                    <FavoriteIcon />
                    <FavoriteIconFill />
                </button>
                <button
                    className={styles.linkToRecipe}
                    data-active={isDefined(recipeId)}
                    data-tooltip-id="link-to-recipe"
                    data-tooltip-content={`${isDefined(recipeId) ? 'View Linked' : 'Link to'} Recipe`}
                    onClick={() => isDefined(recipeId) && handleSelectRecipe(recipeId)}
                >
                    <RecipeIcon />
                    <RecipeIconFill />
                </button>
                <button className={styles.editMealItem} data-tooltip-id="edit-meal-item" data-tooltip-content="Edit Item">
                    <EditIcon />
                </button>
                <button className={styles.removeMealItem} data-tooltip-id="remove-meal-item" data-tooltip-content="Remove Item">
                    <RemoveIcon />
                </button>
            </div>
        </li>
    );
};

export default EventItem;
