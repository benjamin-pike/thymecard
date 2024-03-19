import { FC, useCallback, useState } from 'react';

import RecipeQuickSearch from '@/components/quick-search/recipe/RecipeQuickSearch';
import Tooltip from '@/components/common/tooltip/Tooltip';

import { useQuickSearch } from '@/hooks/common/useQuickSearch';

import { Client, IMealEventItem, IRecipe } from '@thymecard/types';
import { ICONS } from '@/assets/icons';

import styles from './event-items.module.scss';

const AddIcon = ICONS.common.plus;
const RecipeIcon = ICONS.common.recipe;
const CaloriesIcon = ICONS.common.pieChart;
const ServingsIcon = ICONS.recipes.servings;
const RemoveIcon = ICONS.common.XLarge;

interface IEventItemsProps {
    items: IMealEventItem[];
    handleNameChange: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCaloriesChange: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleServingsChange: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLinkRecipe: (id: string, recipe: Client<IRecipe>) => void;
    handleAddItem: () => void;
    handleRemoveItem: (id: string) => () => void;
}

const EventItems: FC<IEventItemsProps> = ({
    items,
    handleNameChange,
    handleCaloriesChange,
    handleServingsChange,
    handleLinkRecipe,
    handleAddItem,
    handleRemoveItem
}) => {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const { quickSearchState, isQuickSearchClosed, openQuickSearch, closeQuickSearch } = useQuickSearch();

    const handleCloseQuickSearch = useCallback(() => {
        closeQuickSearch();
    }, [closeQuickSearch]);

    const handleSelectItem = useCallback(
        (itemId: string) => () => {
            setSelectedItemId(itemId);
            openQuickSearch();
        },
        [openQuickSearch]
    );

    const handleSelectRecipe = useCallback(
        (recipe: Client<IRecipe>) => {
            if (selectedItemId) {
                handleLinkRecipe(selectedItemId, recipe);
            }
        },
        [handleLinkRecipe, selectedItemId]
    );

    return (
        <>
            <section className={styles.items}>
                <h3>Items</h3>
                {!!items.length && (
                    <ul>
                        {items.map((item) => (
                            <EventItem
                                key={item.id}
                                {...item}
                                handleNameChange={handleNameChange(item.id)}
                                handleCaloriesChange={handleCaloriesChange(item.id)}
                                handleServingsChange={handleServingsChange(item.id)}
                                handleSelectItem={handleSelectItem(item.id)}
                                handleRemoveItem={handleRemoveItem(item.id)}
                            />
                        ))}
                    </ul>
                )}
                {!!items.length && items.length % 2 === 0 && <div className={styles.divider} />}
                <button className={styles.addItem} onClick={handleAddItem}>
                    <AddIcon />
                    <p>Add Item</p>
                </button>
            </section>
            <RecipeQuickSearch
                key={isQuickSearchClosed.toString()}
                state={quickSearchState}
                handleSelectResult={handleSelectRecipe}
                handleClose={handleCloseQuickSearch}
            />
            <Tooltip id={'tooltip-calories'} place="bottom" size="small" offset={5} />
            <Tooltip id={'tooltip-servings'} place="bottom" size="small" offset={5} />
            <Tooltip id={'tooltip-remove-item'} place="bottom" size="small" offset={5} />
        </>
    );
};

export default EventItems;

interface IEventItemProps extends IMealEventItem {
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCaloriesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleServingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectItem: () => void;
    handleRemoveItem: () => void;
}

const EventItem: FC<IEventItemProps> = ({
    name,
    calories,
    servings,
    recipeId,
    handleNameChange,
    handleCaloriesChange,
    handleServingsChange,
    handleSelectItem,
    handleRemoveItem
}) => {
    return (
        <li>
            <input className={styles.name} value={name || undefined} placeholder={'Item name'} onChange={handleNameChange} />
            <div className={styles.divider} />
            <div className={styles.calories} data-tooltip-id={'tooltip-calories'} data-tooltip-content="Calories per Serving">
                <input type={'number'} value={calories || undefined} placeholder={''} onChange={handleCaloriesChange} />
                <CaloriesIcon />
            </div>
            <div className={styles.divider} />
            <div className={styles.servings} data-tooltip-id={'tooltip-servings'} data-tooltip-content="Servings">
                <input type={'number'} value={servings || undefined} placeholder={''} onChange={handleServingsChange} />
                <ServingsIcon />
            </div>
            <div className={styles.divider} />
            <button
                className={styles.recipe}
                data-tooltip-id={'tooltip-recipe'}
                data-tooltip-content={'Link Recipe'}
                data-popover-id="popover-item-recipe"
                data-populated={!!recipeId}
                onClick={handleSelectItem}
            >
                <RecipeIcon />
            </button>
            <div className={styles.divider} />
            <button
                className={styles.remove}
                data-tooltip-id={'tooltip-remove-item'}
                data-tooltip-content="Remove Item"
                onClick={handleRemoveItem}
            >
                <RemoveIcon />
            </button>
        </li>
    );
};
