import { FC, useCallback, useMemo, useState } from 'react';
import PopoverWrapper, { PopoverPosition } from '@/components/wrappers/popover/PopoverWrapper';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { isNull } from '@sirona/types';
import { ICONS } from '@/assets/icons';
import styles from './ingredients-edit.module.scss';
import { useRecipe } from '../RecipeProvider';
import { INGREDIENTS_FIELDS } from '@/hooks/recipes/useIngredients';
import { buildKey } from '@sirona/utils';

const TickIcon = ICONS.common.tick;
const QuestionIcon = ICONS.common.question;
const NoMatchIcon = ICONS.common.XLarge;
const AddIcon = ICONS.common.plus;
const DeleteIcon = ICONS.common.XLarge;

const IngredientsEdit: FC = () => {
    const { ingredients, recipe, isIncomplete } = useRecipe();
    const { values, setValues, addIngredient, removeIngredient } = ingredients;

    const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);

    const matchCandidates: Ingredient[] = useMemo(() => JSON.parse(localStorage.getItem('foodstuffs') ?? '[]'), []);
    const matches = useMemo(
        () =>
            values.match.map((match, i) => {
                if (match) {
                    return { ...match, strength: 'confirmed' } as const;
                }

                const item = values.item[i];

                if (!item) {
                    return null;
                }

                const matchCandidate = matchIngredient(item, matchCandidates);

                if (!matchCandidate) {
                    return null;
                }

                return matchCandidate;
            }),
        [matchCandidates, values]
    );

    const handleBlur = useCallback(
        (index: number, field: INGREDIENTS_FIELDS) => (e: React.FocusEvent<HTMLTableCellElement>) => {
            let value: string | null = e.target.innerText;
            value = value.length ? value : null;

            if (value === values[field][index]) {
                return;
            }

            setValues(field, index, value);
        },
        [setValues, values]
    );

    const handleSelectMatch = useCallback(
        (index: number) => () => {
            if (!matches[index]) {
                return;
            }

            setSelectedMatchIndex(index);
        },
        [matches]
    );

    const handleConfirmMatch = useCallback(() => {
        if (isNull(selectedMatchIndex)) {
            return;
        }

        const match = matches[selectedMatchIndex];

        if (!match) {
            return;
        }

        setValues(INGREDIENTS_FIELDS.MATCH, selectedMatchIndex, {
            itemId: match.itemId,
            name: match.name
        });
    }, [matches, selectedMatchIndex, setValues]);

    if (!recipe) {
        return null;
    }

    return (
        <>
            <table className={styles.ingredients}>
                <tbody>
                    {values.item.map((item, i) => {
                        return (
                            <tr key={buildKey(recipe._id, i)} className={styles.row}>
                                <td
                                    className={styles.quantity}
                                    role="textbox"
                                    contentEditable
                                    placeholder="Qty."
                                    data-empty={!values.quantity[i]}
                                    onBlur={handleBlur(i, INGREDIENTS_FIELDS.QUANTITY)}
                                >
                                    {!!values.quantity[i] && values.quantity[i]}
                                </td>
                                <td
                                    className={styles.unit}
                                    role="textbox"
                                    contentEditable
                                    placeholder="Unit"
                                    data-empty={!values.unit[i]}
                                    onBlur={handleBlur(i, INGREDIENTS_FIELDS.UNIT)}
                                >
                                    {!!values.unit[i] && values.unit[i]}
                                </td>
                                <td
                                    className={styles.item}
                                    role="textbox"
                                    contentEditable
                                    placeholder="Ingredient"
                                    data-empty={!item}
                                    data-error={isIncomplete && !item}
                                    onBlur={handleBlur(i, INGREDIENTS_FIELDS.ITEM)}
                                >
                                    {!!item && item}
                                </td>
                                <td
                                    className={styles.prepStyle}
                                    role="textbox"
                                    contentEditable
                                    placeholder="Preparation"
                                    data-empty={!values.prepStyle[i]}
                                    onBlur={handleBlur(i, INGREDIENTS_FIELDS.PREP_STYLE)}
                                >
                                    {!!values.prepStyle[i] && values.prepStyle[i]}
                                </td>
                                <td
                                    className={styles.note}
                                    role="textbox"
                                    contentEditable
                                    placeholder="Notes"
                                    data-empty={!values.note[i]}
                                    onBlur={handleBlur(i, INGREDIENTS_FIELDS.NOTE)}
                                >
                                    {!!values.note[i] && values.note[i]}
                                </td>
                                <button
                                    className={styles.delete}
                                    data-tooltip-id="remove-ingredient"
                                    data-tooltip-content="Remove Ingredient"
                                    onClick={() => removeIngredient(i)}
                                >
                                    <DeleteIcon />
                                </button>
                                <td className={styles.match}>
                                    <button
                                        data-tooltip-id="nutritional-details-match"
                                        data-tooltip-content={MATCH_TOOLTIP_CONTENTS[matches[i]?.strength ?? 'none']}
                                        data-match={matches[i]?.strength ?? 'none'}
                                        data-popover-id={matches[i]?.strength ? 'popover-match' : undefined}
                                        onClick={handleSelectMatch(i)}
                                    >
                                        {MATCH_ICONS[matches[i]?.strength ?? 'none']}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button className={styles.addButton} data-error={isIncomplete && values.item.length === 0} onClick={addIngredient}>
                <AddIcon /> Add Ingredient
            </button>
            <PopoverWrapper
                id="popover-match"
                position={PopoverPosition.BOTTOM_LEFT}
                offset={7.5}
                tooltip={<Tooltip id="nutritional-details-match" place="bottom" size="small" offset={15} />}
            >
                <div className={styles.popover}>
                    <h3>
                        <span className={styles.matched}>Matched</span> Ingredient{' '}
                        <span className={styles.matchedItem}>{!isNull(selectedMatchIndex) && matches[selectedMatchIndex]?.name}</span>
                    </h3>
                    {!isNull(selectedMatchIndex) && matches[selectedMatchIndex]?.strength == 'confirmed' ? (
                        <div className={styles.check}>
                            <p>You confirmed this match</p>
                            <button>Change</button>
                        </div>
                    ) : (
                        <div className={styles.check}>
                            <p>Is this correct?</p>
                            <button onClick={handleConfirmMatch}>Yes</button>
                            <button>No</button>
                        </div>
                    )}
                </div>
            </PopoverWrapper>
            <Tooltip id="remove-ingredient" place="bottom" size="small" offset={10} />
        </>
    );
};

export default IngredientsEdit;

const MATCH_TOOLTIP_CONTENTS = {
    confirmed: 'You matched this ingredient',
    strong: 'Exact match found',
    weak: 'Possible match found',
    none: 'No match found'
};

const MATCH_ICONS = {
    confirmed: <TickIcon />,
    strong: <TickIcon />,
    weak: <QuestionIcon />,
    none: <NoMatchIcon />
};

type Ingredient = {
    code: number;
    name: string;
};

const matchIngredient = (ingredient: string, candidates: Ingredient[], threshold = 3) => {
    let maxScore = 0;
    let match: Ingredient | null = null;
    let matchStrength: 'strong' | 'weak' | 'none' = 'none';

    for (const candidate of candidates) {
        const ingredientTokens = ingredient.toLowerCase().split(' ');
        const candiateTokens = candidate.name.toLowerCase().split(' ');

        const extraTokens = candiateTokens.some(
            (candiateToken) => !ingredientTokens.some((inputToken) => inputToken.includes(candiateToken))
        );

        if (!extraTokens) {
            let currentScore = 0;
            for (const inputToken of ingredientTokens) {
                for (const candiateToken of candiateTokens) {
                    currentScore += scoreMatch(inputToken, candiateToken);
                }
            }

            if (candidate.name.toLowerCase() === ingredient.toLowerCase()) {
                currentScore = Infinity;
            }

            if (currentScore > maxScore) {
                maxScore = currentScore;
                match = candidate;
                matchStrength = currentScore === Infinity ? 'strong' : 'weak';
            }
        }
    }

    if (maxScore < threshold) {
        return null;
    }

    if (!match || matchStrength === 'none') {
        return null;
    }

    return {
        itemId: match.code,
        name: match.name,
        strength: matchStrength
    };
};

const scoreMatch = (ingredient: string, candidate: string) => {
    return ingredient.includes(candidate) ? candidate.length : 0;
};
