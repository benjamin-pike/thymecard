import { FC, useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useStock } from '../StockProvider';
import { usePopoverContext } from '@/components/wrappers/popover/Popover';
import { IStockItem, EStockSection } from '@thymecard/types';
import styles from './move-item-popover.module.scss';

interface IMoveItemPopoverProps {
    item: IStockItem;
    originSection?: EStockSection;
    targetSection: EStockSection;
}

const MoveItemPopover: FC<IMoveItemPopoverProps> = ({ item, originSection, targetSection }) => {
    const { stock, moveItem } = useStock();
    const { handleClosePopover } = usePopoverContext();

    const candidateCategories = useMemo(() => stock[targetSection] ?? [], [stock, targetSection]);
    const itemCategory = originSection ? stock[originSection].find((c) => c.items.some((i) => item && i.id === item.id)) : undefined;

    const shouldDefaultToNewCategory = !candidateCategories.some(({ name }) => name === itemCategory?.name);
    const unnamedCategoryIds: string[] = useMemo(
        () =>
            candidateCategories.reduce(
                (acc: string[], { id, name }: { id: string; name: string | null }) => (name ? acc : [...acc, id]),
                []
            ),
        [candidateCategories]
    );

    const [newSection, setNewSection] = useState<string>();

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

    const handleAddClick = useCallback(() => {
        const isNewCategory = selectedTarget === 'new-item';

        moveItem({
            item,
            targetSection,
            targetCategoryId: isNewCategory ? undefined : selectedTarget,
            newCategoryId: isNewCategory ? uuid() : undefined,
            newCategoryName: isNewCategory ? newSection : undefined,
            removeFromOrigin: originSection === EStockSection.SHOPPING_LIST && targetSection === EStockSection.PANTRY
        });

        handleClosePopover();
    }, [selectedTarget, moveItem, item, targetSection, newSection, originSection, handleClosePopover]);

    return (
        <div key={itemCategory?.name} className={styles.addToFavoritesPopover}>
            <h1>{popoverTitle}</h1>
            <div className={styles.divider} />
            <h2>Select a target category</h2>
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
                            <label htmlFor={id} data-unnamed={!name}>
                                {name || `Unnamed Category #${unnamedCategoryIds.indexOf(id) + 1}`}
                            </label>
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
                <button className={styles.add} disabled={selectedTarget === 'new-item' && !newSection} onClick={handleAddClick}>
                    Add
                </button>
                <button className={styles.cancel} onClick={handleClosePopover}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

const getPopoverTitle = (origin: EStockSection | undefined, target: EStockSection) => {
    switch (target) {
        case EStockSection.PANTRY:
            if (origin === EStockSection.SHOPPING_LIST) {
                return 'Move to Pantry';
            }
            return 'Add to Pantry';
        case EStockSection.SHOPPING_LIST:
            return 'Add to Shopping List';
        case EStockSection.FAVORITES:
            return 'Add to Favorites';
    }
};

export default MoveItemPopover;
