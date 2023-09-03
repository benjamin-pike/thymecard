import { FC, useCallback, useState } from 'react';
import { useClickOutside } from '@/hooks/dom/useClickOutside';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { moveItem } from '@/store/slices/stock';

import { IStockItem, StockTab } from '@/types/recipe.types';

import styles from './move-item-popover.module.scss';

interface IMoveItemPopoverProps {
    item: IStockItem;
    isOpen: boolean;
    originTab?: StockTab;
    targetTab: StockTab;
    location: {
        right: number;
        top: number;
    };
    toggleButtonElement: HTMLButtonElement | null;
    handleClose: () => void;
}

const MoveItemPopover: FC<IMoveItemPopoverProps> = ({ item, isOpen, originTab, targetTab, location, toggleButtonElement, handleClose }) => {
    const dispatch = useDispatch();

    const stockData = useSelector((state: RootState) => state.stock);
    const candidateCategories = useSelector((state: RootState) => state.stock[targetTab]);
    const itemCategory = originTab ? stockData[originTab].find((c) => c.items.some((i) => item && i.id === item.id)) : undefined;
    
    const shouldDefaultToNewCategory = !candidateCategories.some(({ name }) => name === itemCategory?.name);
    
    const [newCategoryName, setNewCategoryName] = useState(shouldDefaultToNewCategory ? itemCategory?.name : '');
    
    const favoritePopoverRef = useClickOutside<HTMLDivElement>(handleClose, [toggleButtonElement]);
    
    const [selectedTarget, setSelectedTarget] = useState(
        shouldDefaultToNewCategory ? 'new-item' : candidateCategories.find((c) => c.name === itemCategory?.name)?.id ?? 'new-item'
    );

    const popoverTitle = getPopoverTitle(originTab, targetTab);

    const updateSelectedTarget = useCallback((id: string) => {
        setSelectedTarget(id);
    }, []);

    const handleNewCategoryInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
        setSelectedTarget('new-item');
    }, []);

    const handleMove = useCallback(() => {
        const isNewCategory = selectedTarget === 'new-item';
        dispatch(
            moveItem({
                item,
                targetTab,
                targetCategoryId: isNewCategory ? undefined : selectedTarget,
                newCategoryName: isNewCategory ? newCategoryName : undefined,
                removeFromOrigin: originTab === 'shopping-list' && targetTab === 'pantry'
            })
        );
        handleClose();
    }, [selectedTarget, newCategoryName]);

    return (
        <div
            ref={favoritePopoverRef}
            key={itemCategory?.name}
            className={styles.addToFavoritesPopover}
            data-open={isOpen}
            style={{
                right: location.right,
                top: location.top
            }}
        >
            <h1>{popoverTitle}</h1>
            <div className={styles.divider} />
            <h2>Select category</h2>
            <ul>
                {candidateCategories.map(({ id, name }) => {
                    return (
                        <li key={id}>
                            <input
                                type="radio"
                                id={id}
                                name="options"
                                data-checked={selectedTarget === id}
                                onChange={() => updateSelectedTarget(id)}
                            />
                            <label htmlFor={id}>{name}</label>
                        </li>
                    );
                })}
                <li>
                    <input
                        type="radio"
                        id="new-item"
                        name="options"
                        data-checked={selectedTarget === 'new-item'}
                        onChange={() => updateSelectedTarget('new-item')}
                    />
                    <label htmlFor="new-item">
                        <input value={newCategoryName} placeholder="New category" onChange={handleNewCategoryInputChange} />
                    </label>
                </li>
            </ul>
            <div className={styles.divider} />
            <div className={styles.buttons}>
                <button disabled={selectedTarget === 'new-item' && !newCategoryName} onClick={handleMove}>
                    Add
                </button>
                <button onClick={handleClose}>Cancel</button>
            </div>
        </div>
    );
};

const getPopoverTitle = (origin: string | undefined, target: string) => {
    switch (target) {
        case 'pantry':
            if (origin === 'shopping-list') {
                return 'Move to Pantry';
            }
            return 'Add to Pantry';
        case 'shopping-list':
            return 'Add to Shopping List';
        case 'favorites':
            return 'Add to Favorites';
    }
};

export default MoveItemPopover;
