import { FC, useCallback, useMemo } from 'react';
import { useStock } from '../StockProvider';
import { ICONS } from '@/assets/icons';
import { IStockCategory, IStockItem, StockSection } from '@thymecard/types';
import styles from './item.module.scss';

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
    section: StockSection;
    category: IStockCategory;
    item: IStockItem;
    nameInputSize: number;
    quantityInputSize: number;
    assignItemRefs: IAssignItemRefs;
    isActive: boolean;
    sectionItemIds: Record<StockSection, string[]>;
    handleMoveItemButtonClick: (target: StockSection) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    focusAdjacentCell: (currentIndex: number, direction: 'up' | 'down' | 'left' | 'right', inputType: 'name' | 'quantity' | 'note') => void;
}

const Item: FC<IItem> = ({
    index,
    totalItems,
    section,
    category,
    item,
    sectionItemIds,
    nameInputSize,
    quantityInputSize,
    assignItemRefs,
    isActive,
    handleMoveItemButtonClick,
    focusAdjacentCell
}) => {
    const { addItem: addItemClosure, updateItem: updateItemClosure, removeItem: removeItemClosure } = useStock();

    const addItem = useMemo(() => addItemClosure(section, category), [addItemClosure, category, section]);
    const updateItem = useMemo(() => updateItemClosure(section, category), [category, section, updateItemClosure]);
    const removeItem = useMemo(() => removeItemClosure(section, category, item.id), [category, item.id, removeItemClosure, section]);

    const isInPantry = sectionItemIds.pantry.includes(item.id);
    const isInShoppingList = sectionItemIds.shoppingList.includes(item.id);
    const isInFavorites = sectionItemIds.favorites.includes(item.id);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, index: number, key: 'name' | 'quantity' | 'note') => {
            updateItem(index, key, e.target.value);
        },
        [updateItem]
    );

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
                        removeItem();
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
                data-type="name"
                onChange={(e) => handleChange(e, index, 'name')}
                onKeyDown={handleInputKeyDown}
            />
            <input
                ref={assignItemRefs.quantity}
                className={styles.quantity}
                size={quantityInputSize || 10}
                placeholder={quantityInputSize ? '' : 'Quantity'}
                value={item.quantity ?? ''}
                data-type="quantity"
                onChange={(e) => handleChange(e, index, 'quantity')}
                onKeyDown={handleInputKeyDown}
            />
            <input
                ref={assignItemRefs.note}
                className={styles.note}
                value={item.note}
                placeholder="Add note"
                data-type="note"
                onChange={(e) => handleChange(e, index, 'note')}
                onKeyDown={handleInputKeyDown}
            />
            <span className={styles.buttons}>
                {section !== StockSection.PANTRY && (
                    <button
                        ref={assignItemRefs.pantryButton}
                        className={styles.moveToPantry}
                        data-tooltip-id="move-to-pantry-stock"
                        data-tooltip-content={
                            isInPantry ? 'Already in Pantry' : `${section === StockSection.SHOPPING_LIST ? 'Move' : 'Add'} to Pantry`
                        }
                        data-active={isInPantry}
                        onClick={handleMoveItemButtonClick(StockSection.PANTRY)}
                    >
                        <MoveToFridgeIcon />
                    </button>
                )}
                {section !== StockSection.SHOPPING_LIST && (
                    <button
                        ref={assignItemRefs.shoppingListButton}
                        className={styles.addToShoppingList}
                        data-tooltip-id="add-to-shopping-list-stock"
                        data-tooltip-content={isInShoppingList ? 'Already in Shopping List' : 'Add to Shopping List'}
                        data-active={isInShoppingList}
                        onClick={handleMoveItemButtonClick(StockSection.SHOPPING_LIST)}
                    >
                        <AddToShoppingListIcon />
                    </button>
                )}
                {section !== StockSection.FAVORITES && (
                    <button
                        ref={assignItemRefs.favoriteButton}
                        className={styles.addToFavorites}
                        data-tooltip-id="add-to-favorites-stock"
                        data-tooltip-content={isInFavorites ? 'Already in Favorites' : 'Add to Favorites'}
                        data-active={isInFavorites}
                        onClick={handleMoveItemButtonClick(StockSection.FAVORITES)}
                    >
                        <StarIcon />
                    </button>
                )}
                <button
                    className={styles.deleteItem}
                    data-tooltip-id="delete-item-stock"
                    data-tooltip-content="Delete Item"
                    onClick={removeItem}
                    onKeyDown={handleButtonKeyDown}
                >
                    <DeleteIcon />
                </button>
            </span>
        </li>
    );
};

export default Item;
