import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToggle } from '@mantine/hooks';
import { useDispatch } from 'react-redux';

import { removeCategory, upsertCategory } from '@/store/slices/stock';

import Item from '../item/Item';
import CustomTooltip from '@/components/common/tooltip/Tooltip';
import MoveItemPopover from '../move-item-popover/MoveItemPopover';

import { ICONS } from '@/assets/icons';
import { IStockCategory, StockData, StockTab } from 'types/recipe.types';
import { formatClasses } from '@/lib/common.utils';

import styles from './category.module.scss';

const ToggleIcon = ICONS.common.toggle;
const DeleteIcon = ICONS.common.XLarge;
const PlusIcon = ICONS.common.plus;

interface ICategory {
    tab: StockTab;
    category: IStockCategory;
    data: StockData;
}

const Category: FC<ICategory> = ({ tab, category, data }) => {
    const dispatch = useDispatch();

    const [categoryName, setCategoryName] = useState(category.name);
    const [items, setItems] = useState(category.items);
    const [expanded, toggleExpanded] = useToggle([true, false]);

    const [isMoveItemPopoverOpen, setIsMoveItemPopoverOpen] = useState(false);
    const [moveItemPopoverItemIndex, setMoveItemPopoverIndex] = useState<number | null>(null);
    const [popoverLocation, setPopoverLocation] = useState({ right: 0, top: 0 });
    const [moveItemTarget, setMoveItemTarget] = useState<StockTab>('pantry');

    const sectionRef = useRef<HTMLLIElement>(null);
    const categoryNameRef = useRef<HTMLInputElement>(null);
    const nameRefs = useRef<(HTMLInputElement | null)[]>([]);
    const quantityRefs = useRef<(HTMLInputElement | null)[]>([]);
    const noteRefs = useRef<(HTMLInputElement | null)[]>([]);
    const pantryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const shoppingListButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const favoriteButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const activeToggleButton = (() => {
        if (moveItemPopoverItemIndex === null) return null;

        switch (moveItemTarget) {
            case 'pantry':
                return pantryButtonRefs.current[moveItemPopoverItemIndex];
            case 'shopping-list':
                return shoppingListButtonRefs.current[moveItemPopoverItemIndex];
            case 'favorites':
                return favoriteButtonRefs.current[moveItemPopoverItemIndex];
        }
    })();

    const itemIds = useMemo(() => {
        const extractIds = (tab: StockTab) => {
            return data[tab].reduce<string[]>((acc, category) => {
                return acc.concat(category.items.map((item) => item.id));
            }, []);
        };

        return {
            pantry: extractIds('pantry'),
            'shopping-list': extractIds('shopping-list'),
            favorites: extractIds('favorites')
        };
    }, [data]);

    const handleInputChange = useCallback((itemIndex: number, key: 'name' | 'quantity' | 'note', value: string) => {
        setItems((prevState) => {
            const updatedItems = JSON.parse(JSON.stringify([...prevState]));
            updatedItems[itemIndex][key] = value;
            return updatedItems;
        });
    }, []);

    const addItem = () => {
        dispatch(
            upsertCategory({
                tab,
                category: { id: category.id, name: categoryName, items: [...items, { id: uuidv4(), name: '', quantity: '', note: '' }] }
            })
        );
    };

    const removeItem = (itemId: string) => {
        dispatch(
            upsertCategory({ tab, category: { id: category.id, name: categoryName, items: items.filter((item) => item.id !== itemId) } })
        );
    };

    const handleBlur = (e: React.FocusEvent<HTMLLIElement>) => {
        const { currentTarget, relatedTarget } = e;

        if (relatedTarget && currentTarget.contains(relatedTarget)) {
            return;
        }

        dispatch(upsertCategory({ tab, category: { id: category.id, name: categoryName, items: items.filter((item) => item.name) } }));
    };

    const focusAdjacentCell = (
        currentIndex: number,
        direction: 'up' | 'down' | 'left' | 'right',
        inputType: 'name' | 'quantity' | 'note'
    ) => {
        switch (direction) {
            case 'up':
            case 'down':
                {
                    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

                    if (nextIndex === -1) {
                        categoryNameRef.current?.focus();
                        return;
                    }

                    if (nextIndex === items.length) {
                        addItem();
                        return;
                    }

                    switch (inputType) {
                        case 'name':
                            nameRefs.current[nextIndex]?.focus();
                            return;
                        case 'quantity':
                            quantityRefs.current[nextIndex]?.focus();
                            return;
                        case 'note':
                            noteRefs.current[nextIndex]?.focus();
                            return;
                    }
                }
                break;
            case 'left':
                if (inputType === 'note') {
                    quantityRefs.current[currentIndex]?.focus();
                } else {
                    nameRefs.current[currentIndex]?.focus();
                }
                return;
            case 'right':
                if (inputType === 'name') {
                    quantityRefs.current[currentIndex]?.focus();
                } else {
                    noteRefs.current[currentIndex]?.focus();
                }
                return;
            default:
                return;
        }
    };

    const handleCategoryNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'Enter':
            case 'StockTab':
            case 'ArrowDown':
                e.preventDefault();

                if (items.length === 0) {
                    addItem();
                } else {
                    focusAdjacentCell(-1, 'down', 'name');
                }

                break;
            case 'Backspace':
            case 'Delete':
                if (categoryName === '') {
                    e.preventDefault();
                    dispatch(removeCategory({ tab, categoryId: category.id }));
                }
                break;
        }
    };

    const handleMoveItemButtonClick = (itemIndex: number) => (target: StockTab) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if (itemIds[target].includes(items[itemIndex].id)) {
            return;
        }

        const element = e.currentTarget as HTMLButtonElement;

        const { right, top } = element.getBoundingClientRect();
        const { right: containerRight, top: containerTop } = sectionRef.current?.getBoundingClientRect() as DOMRect;

        const isSameTarget = target === moveItemTarget && itemIndex === moveItemPopoverItemIndex;

        setTimeout(
            () => {
                setPopoverLocation({
                    right: containerRight - right,
                    top: top - containerTop + element.offsetHeight * 1.35
                });

                setMoveItemPopoverIndex(itemIndex);
                setMoveItemTarget(target);
                setIsMoveItemPopoverOpen((currentState) => !currentState);
            },
            isSameTarget ? 0 : 100
        );
    };

    const handleClosePopover = () => {
        setIsMoveItemPopoverOpen(false);
        setMoveItemPopoverIndex(null);
    };

    const assignItemRefs = (index: number) => {
        return {
            name: (ref: HTMLInputElement | null) => (nameRefs.current[index] = ref),
            quantity: (ref: HTMLInputElement | null) => (quantityRefs.current[index] = ref),
            note: (ref: HTMLInputElement | null) => (noteRefs.current[index] = ref),
            pantryButton: (ref: HTMLButtonElement | null) => (pantryButtonRefs.current[index] = ref),
            shoppingListButton: (ref: HTMLButtonElement | null) => (shoppingListButtonRefs.current[index] = ref),
            favoriteButton: (ref: HTMLButtonElement | null) => (favoriteButtonRefs.current[index] = ref)
        };
    };

    return (
        <>
            <li ref={sectionRef} className={styles.section} onBlur={handleBlur}>
                <span className={styles.category} data-active={expanded}>
                    <button className={styles.toggle} onClick={toggleExpanded}>
                        <ToggleIcon />
                    </button>
                    <input
                        ref={categoryNameRef}
                        value={categoryName}
                        placeholder="Category Name"
                        autoFocus={!categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        onKeyDown={handleCategoryNameKeyDown}
                    />
                    <p className={styles.count}>{items.length} items</p>
                    <button
                        className={styles.deleteCategory}
                        data-tooltip-id="delete-category"
                        data-tooltip-content="Delete Category"
                        onClick={() => dispatch(removeCategory({ tab, categoryId: category.id }))}
                    >
                        <DeleteIcon />
                    </button>
                </span>
                <div className={styles.itemsWrapper} data-active={expanded}>
                    <ul className={styles.items}>
                        {items.map((item, index, arr) => {
                            const nameInputSize = Math.max(...items.map((item) => item.name.length));
                            const quantityInputSize = Math.max(...items.map((item) => item.quantity?.length ?? 0));

                            return (
                                <Item
                                    key={index}
                                    index={index}
                                    totalItems={arr.length}
                                    tab={tab}
                                    item={item}
                                    isActive={index === moveItemPopoverItemIndex}
                                    itemIds={itemIds}
                                    assignItemRefs={assignItemRefs(index)}
                                    focusAdjacentCell={focusAdjacentCell}
                                    nameInputSize={nameInputSize}
                                    quantityInputSize={quantityInputSize}
                                    handleInputChange={handleInputChange}
                                    handleMoveItemButtonClick={handleMoveItemButtonClick(index)}
                                    addItem={addItem}
                                    removeItem={removeItem}
                                />
                            );
                        })}
                        <button className={styles.addItem} onClick={addItem}>
                            <span>
                                <PlusIcon /> Add item
                            </span>
                        </button>
                    </ul>
                </div>
                <MoveItemPopover
                    item={items[moveItemPopoverItemIndex ?? 0]}
                    originTab={tab}
                    targetTab={moveItemTarget}
                    isOpen={isMoveItemPopoverOpen}
                    location={popoverLocation}
                    toggleButtonElement={activeToggleButton}
                    handleClose={handleClosePopover}
                />
            </li>

            <CustomTooltip id="move-to-pantry-stock" size={'small'} place="bottom" offset={10} />
            <CustomTooltip id="add-to-shopping-list-stock" size={'small'} place="bottom" offset={10} />
            <CustomTooltip id="add-to-favorites-stock" size={'small'} place="bottom" offset={10} />
            <CustomTooltip id="delete-item-stock" size={'small'} place="bottom" offset={10} />
            <CustomTooltip id="delete-category" size={'small'} place="bottom" offset={20} />

            <div className={formatClasses(styles, ['divider', 'horizontal'])} />
        </>
    );
};

export default Category;
