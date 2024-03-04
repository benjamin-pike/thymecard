import { FC } from 'react';
import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import { formatClasses } from '@/lib/common.utils';
import { IAlert, IAssignButtonRefs } from '../Nutrition';
import { buildKey } from '@thymecard/utils';
import { EStockSection } from '@thymecard/types';
import styles from './header.module.scss';

const ToggleIcon = ICONS.common.toggle;
const AddToFridgeIcon = ICONS.recipes.addToFridge;
const AddToShoppingListIcon = ICONS.recipes.addToShoppingList;
const AddToFavoritesIcon = ICONS.common.star;

interface IHeaderProps {
    name: string;
    foodGroup: string | null;
    alerts: IAlert[];
    displayDetails: boolean;
    handleToggleDetails: () => void;
    handleMoveItemButtonClick: (target: EStockSection) => (e: React.MouseEvent<HTMLButtonElement>) => void;
    assignButtonRefs: IAssignButtonRefs;
}

const Header: FC<IHeaderProps> = ({
    name,
    foodGroup,
    alerts,
    displayDetails,
    handleToggleDetails,
    handleMoveItemButtonClick,
    assignButtonRefs
}) => {
    return (
        <header className={styles.header}>
            <button className={styles.toggle} data-active={displayDetails} onClick={handleToggleDetails}>
                <ToggleIcon />
            </button>
            <h2>{capitalize(name, true)}</h2>
            {foodGroup && (
                <>
                    <div className={formatClasses(styles, ['divider', 'vertical'])} />
                    <p className={styles.foodGroup}>{capitalize(foodGroup)}</p>
                </>
            )}
            <div className={styles.alerts}>
                {alerts.map(
                    ({ name, active, metric }) =>
                        active && (
                            <p key={buildKey(name, active, metric)} className={styles.alert} data-metric={metric}>
                                {name}
                            </p>
                        )
                )}
            </div>
            {alerts.some(({ active }) => active) && <div className={formatClasses(styles, ['divider', 'vertical'])} />}
            <div className={styles.buttons}>
                <button
                    ref={assignButtonRefs.pantry}
                    className={styles.pantry}
                    data-tooltip-id={'add-to-pantry-nutrition'}
                    data-tooltip-content={'Add to Pantry'}
                    onClick={handleMoveItemButtonClick(EStockSection.PANTRY)}
                >
                    <AddToFridgeIcon />
                </button>
                <button
                    ref={assignButtonRefs.shoppingList}
                    className={styles.shoppingList}
                    data-tooltip-id={'add-to-shopping-list-nutrition'}
                    data-tooltip-content={'Add to Shopping List'}
                    onClick={handleMoveItemButtonClick(EStockSection.PANTRY)}
                >
                    <AddToShoppingListIcon />
                </button>
                <button
                    ref={assignButtonRefs.favorites}
                    className={styles.favorites}
                    data-tooltip-id={'add-to-favorites-nutrition'}
                    data-tooltip-content={'Add to Favorites'}
                    onClick={handleMoveItemButtonClick(EStockSection.PANTRY)}
                >
                    <AddToFavoritesIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;
