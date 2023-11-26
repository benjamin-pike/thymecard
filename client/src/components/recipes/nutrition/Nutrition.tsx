import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { v5 as uuidv5 } from 'uuid';
import { useToggle } from '@mantine/hooks';

import Search from './search/Search';
import Header from './header/Header';
import Serving from './serving/Serving';
import SimpleNutrients from './nutrients/SimpleNutrients';
import DetailedNutrients from './nutrients/DetailedNutrients';
import MoveItemPopover from '../stock/move-item-popover/MoveItemPopover';
import CustomTooltip from '@/components/common/tooltip/Tooltip';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';

import { formatClasses, queue } from '@/lib/common.utils';
import { round } from '@/lib/number.utils';
import { capitalize } from '@/lib/string.utils';
import { generateNutitionalInfo } from '@/test/mock-data/recipes';
import { INutrients, IServing } from 'types/recipe.types';

import styles from './nutrition.module.scss';
import { StockSection } from '@thymecard/types';

interface INutritionProps {
    handleToggleVisibleInfo: () => void;
}

export interface IAlert {
    name: string;
    active: boolean;
    metric: string;
}

const ID_NAMESPACE = '056adc0f-8bbe-4ca8-9f6d-1eaff39ac588';

const Nutrition: FC<INutritionProps> = ({ handleToggleVisibleInfo }) => {
    const [searchValue, setSearchValue] = useState('');

    const data = useMemo(generateNutitionalInfo, []);

    const [quantities, setQuantities] = useState<IServing[]>(
        data.map((entry) => ({
            quantity: entry.servingQuantity,
            unit: entry.servingUnit,
            weight: entry.servingWeight
        }))
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const pantryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const shoppingListButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const favoritesButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const [isMoveItemPopoverOpen, setIsMoveItemPopoverOpen] = useState(false);
    const [moveItemPopoverItemIndex, setMoveItemPopoverIndex] = useState<number | null>(null);
    const [popoverLocation, setPopoverLocation] = useState({ right: 0, top: 0 });
    const [moveItemTarget, setMoveItemTarget] = useState<StockSection>(StockSection.PANTRY);

    const item = (() => {
        const itemIndex = moveItemPopoverItemIndex ?? 0;
        const serving = quantities[itemIndex];

        return {
            id: uuidv5(data[itemIndex].name, ID_NAMESPACE),
            name: capitalize(data[itemIndex].name, true),
            quantity: `${serving.quantity} ${serving.unit}`,
            note: ''
        };
    })();

    const activeToggleButton = (() => {
        if (moveItemPopoverItemIndex === null) return null;

        switch (moveItemTarget) {
            case StockSection.PANTRY:
                return pantryButtonRefs.current[moveItemPopoverItemIndex];
            case StockSection.SHOPPING_LIST:
                return shoppingListButtonRefs.current[moveItemPopoverItemIndex];
            case StockSection.FAVORITES:
                return favoritesButtonRefs.current[moveItemPopoverItemIndex];
        }
    })();

    const handleQuantityChange = useCallback(
        (index: number) => (quantity: IServing) => {
            const newQuantities = [...quantities];
            newQuantities[index] = quantity;
            setQuantities(newQuantities);
        },
        [quantities]
    );

    const handleMoveItemButtonClick = (itemIndex: number) => (target: StockSection) => (e: React.MouseEvent<HTMLButtonElement>) => {
        const element = e.currentTarget as HTMLButtonElement;

        const { right, top } = element.getBoundingClientRect();
        const { right: containerRight, top: containerTop } = containerRef.current?.getBoundingClientRect() as DOMRect;

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

    const assignButtonRefs = (index: number) => {
        return {
            pantry: (ref: HTMLButtonElement | null) => (pantryButtonRefs.current[index] = ref),
            shoppingList: (ref: HTMLButtonElement | null) => (shoppingListButtonRefs.current[index] = ref),
            favorites: (ref: HTMLButtonElement | null) => (favoritesButtonRefs.current[index] = ref)
        };
    };

    return (
        <section className={styles.nutrition}>
            <Search value={searchValue} setValue={setSearchValue} handleToggleVisibleInfo={handleToggleVisibleInfo} />
            <div className={formatClasses(styles, ['divider', 'horizontal'])}></div>
            <div className={styles.scrollContainer}>
                <ScrollWrapper height={'100%'} padding={1}>
                    <div ref={containerRef} className={styles.body}>
                        {data.map((entry, i, arr) => (
                            <>
                                <Entry
                                    {...entry}
                                    defaultServing={{
                                        quantity: entry.servingQuantity,
                                        unit: entry.servingUnit,
                                        weight: entry.servingWeight
                                    }}
                                    servingState={quantities[i]}
                                    handleQuantityChange={handleQuantityChange(i)}
                                    assignButtonRefs={assignButtonRefs(i)}
                                    handleMoveItemButtonClick={handleMoveItemButtonClick(i)}
                                />
                                {i !== arr.length - 1 && <div className={formatClasses(styles, ['divider', 'horizontal'])}></div>}
                            </>
                        ))}

                        <MoveItemPopover
                            item={item}
                            targetSection={moveItemTarget}
                            isOpen={isMoveItemPopoverOpen}
                            location={popoverLocation}
                            toggleButtonElement={activeToggleButton}
                            handleClose={handleClosePopover}
                        />
                    </div>
                </ScrollWrapper>
            </div>
        </section>
    );
};

interface IEntryProps {
    name: string;
    foodGroup: string | null;
    defaultServing: IServing;
    altServings: IServing[];
    servingState: IServing;
    metrics: INutrients;
    handleQuantityChange: (quantity: IServing) => void;
    assignButtonRefs: IAssignButtonRefs;
    handleMoveItemButtonClick: (target: StockSection) => (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Entry: FC<IEntryProps> = ({
    name,
    foodGroup,
    metrics,
    altServings,
    defaultServing,
    servingState,
    handleQuantityChange,
    assignButtonRefs,
    handleMoveItemButtonClick
}) => {
    const [displayDetails, toggleDetails] = useToggle([false, true]);
    const [renderDetails, setRenderDetails] = useState(false);

    const servingWeight = servingState.weight;

    const quantityValue = round(servingState.quantity, 1);
    const weightValue = round(servingWeight, 1);

    const alerts: IAlert[] = [
        {
            name: 'High Sugar',
            active: !!metrics.sugars && metrics.sugars > 22.5,
            metric: 'carbs'
        },
        {
            name: 'High Protein',
            active: metrics.protein > 15,
            metric: 'protein'
        },
        {
            name: 'High Fat',
            active: metrics.fat > 17.5,
            metric: 'fat'
        },
        {
            name: 'High Sodium',
            active: !!metrics.sodium && metrics.sodium > 1.5,
            metric: 'minerals'
        }
    ];

    const incrementQuantity = useCallback(() => {
        const newQuantity = servingState.quantity + 1;

        handleQuantityChange({
            ...servingState,
            quantity: newQuantity,
            weight: servingWeight * (newQuantity / servingState.quantity)
        });
    }, [handleQuantityChange, servingState, servingWeight]);

    const decrementQuantity = useCallback(() => {
        const newQuantity = servingState.quantity - 1;

        handleQuantityChange({
            ...servingState,
            quantity: newQuantity,
            weight: servingWeight * (newQuantity / servingState.quantity)
        });
    }, [handleQuantityChange, servingState, servingWeight]);

    const handleQuantityInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newQuantity = parseInt(e.target.value);
            if (isNaN(newQuantity)) return;

            handleQuantityChange({
                ...servingState,
                quantity: newQuantity,
                weight: servingWeight * (newQuantity / servingState.quantity)
            });
        },
        [handleQuantityChange, servingState, servingWeight]
    );

    const handleWeightInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newWeight = parseFloat(e.target.value);
            if (isNaN(newWeight)) return;

            handleQuantityChange({
                ...servingState,
                weight: newWeight,
                quantity: servingState.quantity * (newWeight / servingWeight)
            });
        },
        [handleQuantityChange, servingState, servingWeight]
    );

    const handleResetScale = useCallback(() => {
        handleQuantityChange(defaultServing);
    }, [defaultServing, handleQuantityChange]);

    const handleAltQuantityClick = useCallback(
        (closeDropdown: () => void) => (index: number) => () => {
            const altServing = altServings[index];
            handleQuantityChange({
                ...altServing,
                quantity: altServing.quantity
            });
            closeDropdown();
        },
        [altServings, handleQuantityChange]
    );

    const handleToggleDetails = useCallback(() => {
        if (!displayDetails) {
            setRenderDetails(true);
        } else {
            setTimeout(() => setRenderDetails(false), 300);
        }

        queue(toggleDetails);
    }, [displayDetails, toggleDetails]);

    return (
        <article className={styles.entry}>
            <Header
                name={name}
                foodGroup={foodGroup}
                alerts={alerts}
                displayDetails={displayDetails}
                handleToggleDetails={handleToggleDetails}
                handleMoveItemButtonClick={handleMoveItemButtonClick}
                assignButtonRefs={assignButtonRefs}
            />
            <Serving
                quantity={quantityValue}
                unit={servingState.unit}
                weight={weightValue}
                altServings={altServings}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                handleQuantityInput={handleQuantityInput}
                handleWeightInput={handleWeightInput}
                handleResetScale={handleResetScale}
                handleAltQuantityClick={handleAltQuantityClick}
            />
            <section className={styles.nutrients}>
                <SimpleNutrients
                    isVisible={!displayDetails}
                    energy={round(metrics.energy, 0)}
                    carbohydrates={round(metrics.carbohydrates, 1)}
                    protein={round(metrics.protein, 1)}
                    fat={round(metrics.fat, 1)}
                    sodium={round((metrics.sodium ?? 0) * 1000, 0)}
                />
                {renderDetails && <DetailedNutrients isVisible={displayDetails} values={metrics} />}
            </section>

            <CustomTooltip id="add-to-pantry-nutrition" place="bottom" size="small" offset={10} />
            <CustomTooltip id="add-to-shopping-list-nutrition" place="bottom" size="small" offset={10} />
            <CustomTooltip id="add-to-favorites-nutrition" place="bottom" size="small" offset={10} />

            <CustomTooltip id="energy" place="bottom" size="small" offset={10} />
            <CustomTooltip id="carbs" place="bottom" size="small" offset={10} />
            <CustomTooltip id="protein" place="bottom" size="small" offset={10} />
            <CustomTooltip id="fat" place="bottom" size="small" offset={10} />
            <CustomTooltip id="sodium" place="bottom" size="small" offset={10} />
        </article>
    );
};

export interface IAssignButtonRefs {
    pantry: (ref: HTMLButtonElement | null) => HTMLButtonElement | null;
    shoppingList: (ref: HTMLButtonElement | null) => HTMLButtonElement | null;
    favorites: (ref: HTMLButtonElement | null) => HTMLButtonElement | null;
}

export default Nutrition;
