import { FC, useCallback, useState } from 'react';
import PopoverWrapper, { PopoverPosition } from '@/components/wrappers/popover/PopoverWrapper';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { useIngredients } from './IngredientsProvider';
import { IIngredientMatch, IngredientMatchStrength } from '@/types/recipe.types';
import { ICONS } from '@/assets/icons';
import styles from './ingredients-edit.module.scss';

const TickIcon = ICONS.common.tick;
const QuestionIcon = ICONS.common.question;
const NoMatchIcon = ICONS.common.XLarge;

const IngredientsEdit: FC = () => {
    const [selectedMatch, setSelectedMatch] = useState<IIngredientMatch | null>(null);

    const {
        ingredients,
        quantityValues,
        unitValues,
        itemValues,
        prepStyleValues,
        noteValues,
        setQuantityValues,
        setUnitValues,
        setItemValues,
        setPrepStyleValues,
        setNoteValues
    } = useIngredients();

    const handleQuantityInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.innerText;
        const updatedValues = [...quantityValues];

        if (!val.length) {
            updatedValues[index] = null;
            return setQuantityValues(updatedValues);
        }

        const parsedVal = val.includes('.') ? parseFloat(val) : parseInt(val);

        if (isNaN(parsedVal)) {
            e.target.innerText = '';
            return;
        }

        updatedValues[index] = parsedVal;
        setQuantityValues(updatedValues);
    };

    const handleQuantityInputBlur = (index: number) => (e: React.FocusEvent<HTMLSpanElement>) => {
        e.target.innerText = Number(quantityValues[index]).toString();
    };

    const handleUnitInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.innerText;
        const updatedValues = [...unitValues];
        updatedValues[index] = val.length ? val : null;
        setUnitValues(updatedValues);
    };

    const handleItemInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.innerText;
        const updatedValues = [...itemValues];
        updatedValues[index] = val.length ? val : null;
        setItemValues(updatedValues);
    };

    const handlePrepStyleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.innerText;
        const updatedValues = [...prepStyleValues];
        updatedValues[index] = val.length ? val : null;
        setPrepStyleValues(updatedValues);
    };

    const handleNoteInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.innerText;
        const updatedValues = [...noteValues];
        updatedValues[index] = val.length ? val : null;
        setNoteValues(updatedValues);
    };

    const handleSelectMatch = useCallback(
        (match: IIngredientMatch | null) => () => {
            if (!match) {
                return;
            }

            setSelectedMatch(match);
        },
        []
    );

    return (
        <>
            <div className={styles.ingredients}>
                <ul className={styles.quantities}>
                    {ingredients.map((ingredient, i) => (
                        <li className={styles.quantity}>
                            <span
                                role='textbox'
                                contentEditable
                                data-empty={!quantityValues[i]}
                                onInput={handleQuantityInputChange(i)}
                                onBlur={handleQuantityInputBlur(i)}
                            >
                                {!!ingredient.quantity && ingredient.quantity}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className={styles.units}>
                    {ingredients.map((ingredient, i) => (
                        <li className={styles.unit}>
                            <span role='textbox' contentEditable data-empty={!unitValues[i]} onInput={handleUnitInputChange(i)}>
                                {!!ingredient.unit && ingredient.unit}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className={styles.items}>
                    {ingredients.map((ingredient, i) => (
                        <li key={i} className={styles.item}>
                            <span role='textbox' contentEditable data-empty={!itemValues[i]} onInput={handleItemInputChange(i)}>
                                {!!ingredient.item && ingredient.item}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className={styles.prepStyles}>
                    {ingredients.map((ingredient, i) => (
                        <li className={styles.prepStyle}>
                            <span role='textbox' contentEditable data-empty={!prepStyleValues[i]} onInput={handlePrepStyleInputChange(i)}>
                                {!!ingredient.prepStyles && ingredient.prepStyles}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className={styles.notes}>
                    {ingredients.map((ingredient, i) => (
                        <li className={styles.note}>
                            <span role='textbox' contentEditable data-empty={!noteValues[i]} onInput={handleNoteInputChange(i)}>
                                {!!ingredient.notes && ingredient.notes}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className={styles.matches}>
                    {ingredients.map(({ match }) => {
                        const strength = match?.strength ?? 'none';

                        const tooltipContents: Record<IngredientMatchStrength, string> = {
                            confirmed: 'You matched this ingredient',
                            strong: 'Exact match found',
                            weak: 'Possible match found',
                            none: 'No match found'
                        };

                        const icon = {
                            confirmed: <TickIcon />,
                            strong: <TickIcon />,
                            weak: <QuestionIcon />,
                            none: <NoMatchIcon />
                        };

                        return (
                            <li className={styles.match}>
                                <button
                                    data-tooltip-id="nutritional-details-match"
                                    data-tooltip-content={tooltipContents[strength]}
                                    data-match={strength}
                                    data-popover-id={match?.strength ? 'popover-match' : undefined}
                                    onClick={handleSelectMatch(match)}
                                >
                                    {icon[strength]}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <PopoverWrapper
                id="popover-match"
                position={PopoverPosition.BOTTOM_LEFT}
                offset={7.5}
                tooltip={<Tooltip id="nutritional-details-match" place="bottom" size="small" offset={15} />}
            >
                <div className={styles.popover}>
                    <h3>
                        <span className={styles.matched}>Matched</span> Ingredient{' '}
                        <span className={styles.matchedItem}>{selectedMatch?.name}</span>
                    </h3>
                    {selectedMatch?.strength == 'confirmed' ? (
                        <div className={styles.check}>
                            <p>You confirmed this match</p>
                            <button>Change</button>
                        </div>
                    ) : (
                        <div className={styles.check}>
                            <p>Is this correct?</p>
                            <button>Yes</button>
                            <button>No</button>
                        </div>
                    )}
                </div>
            </PopoverWrapper>
        </>
    );
};

export default IngredientsEdit;
