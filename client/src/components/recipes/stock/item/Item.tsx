import { FC } from 'react';
import styles from './item.module.scss';
import { ICONS } from '@/assets/icons';
import { IStockItem, StockTab } from '@/types/recipe.types';

const MoveToFridgeIcon = ICONS.recipes.addToFridge;
const AddToShoppingListIcon = ICONS.recipes.addToShoppingList;
const DeleteIcon = ICONS.common.XLarge;
const StarIcon = ICONS.common.star;

interface IAssignItemRefs {
    name: (ref: HTMLInputElement | null) => HTMLInputElement | null;
    quantity: (ref: HTMLInputElement | null) => HTMLInputElement | null;
    note: (ref: HTMLInputElement | null) => HTMLInputElement | null;
    pantryButton: (ref: HTMLButtonElement | null) => HTMLButtonElement | null;
    shoppingListButton: (ref: HTMLButtonElement | null) => HTMLButtonElement | null;
    favoriteButton: (ref: HTMLButtonElement | null) => HTMLButtonElement | null;
}

export interface IItem {
    index: number;
    totalItems: number;
    tab: StockTab;
    item: IStockItem;
    nameInputSize: number;
    quantityInputSize: number;
    assignItemRefs: IAssignItemRefs;
    isActive: boolean;
    itemIds: Record<StockTab, string[]>;
    handleInputChange: (index: number, key: 'name' | 'quantity' | 'note', value: string) => void;
    handleMoveItemButtonClick: (target: StockTab) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    addItem: () => void;
    removeItem: (itemId: string) => void;
    focusAdjacentCell: (currentIndex: number, direction: 'up' | 'down' | 'left' | 'right', inputType: 'name' | 'quantity' | 'note') => void;
}

const Item: FC<IItem> = ({
    index,
    totalItems,
    tab,
    item,
    itemIds,
    nameInputSize,
    quantityInputSize,
    assignItemRefs,
    isActive,
    handleInputChange,
    handleMoveItemButtonClick,
    addItem,
    removeItem,
    focusAdjacentCell
}) => {
    const isInPantry = itemIds.pantry.includes(item.id);
    const isInShoppingList = itemIds['shopping-list'].includes(item.id);
    const isInFavorites = itemIds.favorites.includes(item.id);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const inputType = e.currentTarget.getAttribute('data-type') as 'name' | 'quantity' | 'note';

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                
                if (index === totalItems - 1) {
                    addItem();
                } else {
                    focusAdjacentCell(index, 'down', inputType);
                }
                break;
            case 'Backspace':
            case 'Delete':
                if (target.value === '') {
                    e.preventDefault();
                    
                    if (inputType === 'name') {
                        focusAdjacentCell(index, 'up', inputType);
                        removeItem(item.id);
                    } else {
                        focusAdjacentCell(index, 'left', inputType);
                    }
                }
                break;
            case 'ArrowUp':
                focusAdjacentCell(index, 'up', inputType);
                break;
            case 'ArrowDown':
                focusAdjacentCell(index, 'down', inputType);
                break;
            case 'ArrowLeft':
                if (target.selectionStart === 0) {
                    e.preventDefault();
                    focusAdjacentCell(index, 'left', inputType);
                }
                break;
            case 'ArrowRight':
                if (target.selectionEnd === target.value.length) {
                    e.preventDefault();
                    focusAdjacentCell(index, 'right', inputType);
                }
                break;
        }
    };

    const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <li className={styles.row} data-active={isActive}>
            <input
                ref={assignItemRefs.name}
                className={styles.item}
                size={nameInputSize || 12}
                value={item.name}
                placeholder={nameInputSize ? '' : 'Item name'}
                autoFocus={!item.name}
                data-type="name"
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                onKeyDown={handleInputKeyDown}
            />
            <input
                ref={assignItemRefs.quantity}
                className={styles.quantity}
                size={quantityInputSize || 10}
                placeholder={quantityInputSize ? '' : 'Quantity'}
                value={item.quantity ?? ''}
                data-type="quantity"
                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                onKeyDown={handleInputKeyDown}
            />
            <input
                ref={assignItemRefs.note}
                className={styles.note}
                value={item.note}
                placeholder="Add note"
                data-type="note"
                onChange={(e) => handleInputChange(index, 'note', e.target.value)}
                onKeyDown={handleInputKeyDown}
            />
            <span className={styles.buttons}>
                {tab !== 'pantry' && (
                    <button
                        ref={assignItemRefs.pantryButton}
                        className={styles.moveToPantry}
                        data-tooltip-id="move-to-pantry-stock"
                        data-tooltip-content={isInPantry ? 'Already in Pantry' : `${tab === 'shopping-list' ? 'Move' : 'Add'} to Pantry`}
                        data-active={isInPantry}
                        onClick={handleMoveItemButtonClick('pantry')}
                    >
                        <MoveToFridgeIcon />
                    </button>
                )}
                {tab !== 'shopping-list' && (
                    <button
                        ref={assignItemRefs.shoppingListButton}
                        className={styles.addToShoppingList}
                        data-tooltip-id="add-to-shopping-list-stock"
                        data-tooltip-content={isInShoppingList ? 'Already in Shopping List' : 'Add to Shopping List'}
                        data-active={isInShoppingList}
                        onClick={handleMoveItemButtonClick('shopping-list')}
                    >
                        <AddToShoppingListIcon />
                    </button>
                )}
                {tab !== 'favorites' && (
                    <button
                        ref={assignItemRefs.favoriteButton}
                        className={styles.addToFavorites}
                        data-tooltip-id="add-to-favorites-stock"
                        data-tooltip-content={isInFavorites ? 'Already in Favorites' : 'Add to Favorites'}
                        data-active={isInFavorites}
                        onClick={handleMoveItemButtonClick('favorites')}
                    >
                        <StarIcon />
                    </button>
                )}
                <button
                    className={styles.deleteItem}
                    data-tooltip-id="delete-item-stock"
                    data-tooltip-content="Delete Item"
                    onClick={() => removeItem(item.id)}
                    onKeyDown={handleButtonKeyDown}
                >
                    <DeleteIcon />
                </button>
            </span>
        </li>
    );
};

export default Item;
