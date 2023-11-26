import { FC, useCallback, useState } from 'react';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import { useStock } from '../StockProvider';
import { IStockItem, StockSection } from '@thymecard/types';
import styles from './move-item-popover.module.scss';

interface IMoveItemPopoverProps {
    item: IStockItem;
    isOpen: boolean;
    originSection?: StockSection;
    targetSection: StockSection;
    location: {
        right: number;
        top: number;
    };
    toggleButtonElement: HTMLButtonElement | null;
    handleClose: () => void;
}

const MoveItemPopover: FC<IMoveItemPopoverProps> = ({
    item,
    isOpen,
    originSection,
    targetSection,
    location,
    toggleButtonElement,
    handleClose
}) => {
    const { stock, moveItem } = useStock();

    const candidateCategories = stock[targetSection] ?? [];
    const itemCategory = originSection ? stock[originSection].find((c) => c.items.some((i) => item && i.id === item.id)) : undefined;

    const shouldDefaultToNewCategory = !candidateCategories.some(({ name }) => name === itemCategory?.name);

    const [newSection, setNewSection] = useState(shouldDefaultToNewCategory ? itemCategory?.name : '');

    const favoritePopoverRef = useClickOutside<HTMLDivElement>(handleClose, [toggleButtonElement]);

    const [selectedTarget, setSelectedTarget] = useState(
        shouldDefaultToNewCategory ? 'new-item' : candidateCategories.find((c) => c.name === itemCategory?.name)?.id ?? 'new-item'
    );

    const popoverTitle = getPopoverTitle(originSection, targetSection);

    const updateSelectedTarget = useCallback((id: string) => {
        setSelectedTarget(id);
    }, []);

    const handleNewCategoryInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSection(e.target.value);
        setSelectedTarget('new-item');
    }, []);

    const handleMove = useCallback(() => {
        const isNewCategory = selectedTarget === 'new-item';
        moveItem({
            item,
            targetSection,
            targetCategoryId: isNewCategory ? undefined : selectedTarget,
            newSection: isNewCategory ? newSection : undefined,
            removeFromOrigin: originSection === StockSection.SHOPPING_LIST && targetSection === StockSection.PANTRY
        });
        handleClose();
    }, [selectedTarget, moveItem, item, targetSection, newSection, originSection, handleClose]);

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
                        <input value={newSection} placeholder="New category" onChange={handleNewCategoryInputChange} />
                    </label>
                </li>
            </ul>
            <div className={styles.divider} />
            <div className={styles.buttons}>
                <button disabled={selectedTarget === 'new-item' && !newSection} onClick={handleMove}>
                    Add
                </button>
                <button onClick={handleClose}>Cancel</button>
            </div>
        </div>
    );
};

const getPopoverTitle = (origin: StockSection | undefined, target: StockSection) => {
    switch (target) {
        case StockSection.PANTRY:
            if (origin === StockSection.SHOPPING_LIST) {
                return 'Move to Pantry';
            }
            return 'Add to Pantry';
        case StockSection.SHOPPING_LIST:
            return 'Add to Shopping List';
        case StockSection.FAVORITES:
            return 'Add to Favorites';
    }
};

export default MoveItemPopover;
