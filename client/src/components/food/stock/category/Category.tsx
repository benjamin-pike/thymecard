import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useStock } from '../StockProvider';

import Item from '../item/Item';
import CustomTooltip from '@/components/common/tooltip/Tooltip';
import MoveItemPopover from '../move-item-popover/MoveItemPopover';

import { formatClasses } from '@/lib/common.utils';
import { IStockCategory, EStockSection } from '@thymecard/types';
import { ICONS } from '@/assets/icons';

import styles from './category.module.scss';

const ToggleIcon = ICONS.common.toggle;
const DeleteIcon = ICONS.common.XLarge;

interface ICategory {
    section: EStockSection;
    category: IStockCategory;
}

const Category: FC<ICategory> = ({ section, category }) => {
    const {
        stock,
        addItem: addItemClosure,
        removeCategory: removeCategoryClosure,
        updateCategoryName: updateCategoryNameClosure
    } = useStock();

    const addItem = addItemClosure(section, category);
    const removeCategory = removeCategoryClosure(section, category.id);
    const updateCategoryName = updateCategoryNameClosure(section, category);

    const [expanded, toggleExpanded] = useToggle([true, false]);

    const [isMoveItemPopoverOpen, setIsMoveItemPopoverOpen] = useState(false);
    const [moveItemPopoverItemIndex, setMoveItemPopoverIndex] = useState<number | null>(null);
    const [popoverLocation, setPopoverLocation] = useState({ right: 0, top: 0 });
    const [moveItemTarget, setMoveItemTarget] = useState<EStockSection>(EStockSection.PANTRY);

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
            case EStockSection.PANTRY:
                return pantryButtonRefs.current[moveItemPopoverItemIndex];
            case EStockSection.SHOPPING_LIST:
                return shoppingListButtonRefs.current[moveItemPopoverItemIndex];
            case EStockSection.FAVORITES:
                return favoriteButtonRefs.current[moveItemPopoverItemIndex];
        }
    })();

    const sectionItemIds = useMemo(() => {
        const extractIds = (section: EStockSection) => {
            return stock[section].reduce<string[]>((acc, category) => {
                return acc.concat(category.items.map((item) => item.id));
            }, []);
        };

        return {
            [EStockSection.PANTRY]: extractIds(EStockSection.PANTRY),
            [EStockSection.SHOPPING_LIST]: extractIds(EStockSection.SHOPPING_LIST),
            [EStockSection.FAVORITES]: extractIds(EStockSection.FAVORITES)
        };
    }, [stock]);

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
                        sectionRef.current?.focus();
                        return;
                    }

                    if (nextIndex === category.items.length) {
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

    const handleCategoryNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
        updateCategoryName(e.target.value);
    };

    const handleCategoryNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'Enter':
            case 'Tab':
            case 'ArrowDown':
                e.preventDefault();

                if (category.items.length === 0) {
                    addItem();
                } else {
                    focusAdjacentCell(-1, 'down', 'name');
                }

                break;
            case 'Backspace':
            case 'Delete':
                if (category.name === '') {
                    e.preventDefault();
                    removeCategory();
                }
                break;
        }
    };

    const handleMoveItemButtonClick = (itemIndex: number) => (targetSection: EStockSection) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if (sectionItemIds[targetSection].includes(category.items[itemIndex].id)) {
            return;
        }

        const element = e.currentTarget as HTMLButtonElement;

        const { right, top } = element.getBoundingClientRect();
        const { right: containerRight, top: containerTop } = sectionRef.current?.getBoundingClientRect() as DOMRect;

        const isSameTarget = targetSection === moveItemTarget && itemIndex === moveItemPopoverItemIndex;

        setTimeout(
            () => {
                setPopoverLocation({
                    right: containerRight - right,
                    top: top - containerTop + element.offsetHeight * 1.35
                });

                setMoveItemPopoverIndex(itemIndex);
                setMoveItemTarget(targetSection);
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

    useEffect(() => {
        if (!categoryNameRef.current) return;
        categoryNameRef.current.value = category.name;
    }, [category.name]);

    return (
        <>
            <li ref={sectionRef} className={styles.section}>
                <span className={styles.category} data-active={expanded}>
                    <button className={styles.toggle} onClick={toggleExpanded}>
                        <ToggleIcon />
                    </button>
                    <input
                        ref={categoryNameRef}
                        placeholder="Category Name"
                        onChange={handleCategoryNameChange}
                        onKeyDown={handleCategoryNameKeyDown}
                    />
                    <p className={styles.count}>
                        {category.items.length} Item{category.items.length !== 1 ? 's' : ''}
                    </p>
                    <button
                        className={styles.deleteCategory}
                        data-tooltip-id="delete-category"
                        data-tooltip-content="Delete Category"
                        onClick={removeCategory}
                    >
                        <DeleteIcon />
                    </button>
                </span>
                <div className={styles.itemsWrapper} data-active={expanded}>
                    <ul className={styles.items}>
                        {category.items.map((item, index, arr) => {
                            const nameInputSize = Math.max(...category.items.map((item) => item.name.length));
                            const quantityInputSize = Math.max(...category.items.map((item) => item.quantity?.length ?? 0));

                            return (
                                <Item
                                    key={index}
                                    index={index}
                                    totalItems={arr.length}
                                    section={section}
                                    category={category}
                                    item={item}
                                    isActive={index === moveItemPopoverItemIndex}
                                    sectionItemIds={sectionItemIds}
                                    assignItemRefs={assignItemRefs(index)}
                                    focusAdjacentCell={focusAdjacentCell}
                                    nameInputSize={nameInputSize}
                                    quantityInputSize={quantityInputSize}
                                    handleMoveItemButtonClick={handleMoveItemButtonClick(index)}
                                />
                            );
                        })}
                        <button className={styles.addItem} onClick={addItem}>
                            <span>Add Item</span>
                        </button>
                    </ul>
                </div>
                <MoveItemPopover
                    item={category.items[moveItemPopoverItemIndex ?? 0]}
                    originSection={section}
                    targetSection={moveItemTarget}
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
