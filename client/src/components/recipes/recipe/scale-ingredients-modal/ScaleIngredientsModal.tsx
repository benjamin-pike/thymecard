import { FC, useCallback, useState } from 'react';
import styles from './scale-ingredients-modal.module.scss';
import { ICONS } from '@/assets/icons';
import { round } from '@/lib/number.utils';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { useIngredients } from '../ingredients/IngredientsProvider';

const ScaleIcon = ICONS.recipes.scales;

const MULTIPLIERS = [0.5, 1.5, 2, 3];

interface IScaleIngredientsModalProps {
    currentMultiplier: number;
    recipeYield: {
        quantity: number[];
        units: string;
    };
    handleApply: (multiplier: number) => () => void;
    handleClose: () => void;
}

const ScaleIngredientsModal: FC<IScaleIngredientsModalProps> = ({ currentMultiplier, recipeYield, handleApply, handleClose }) => {
    const { ingredients } = useIngredients();

    const [selectedMultiplier, setSelectedMultiplier] = useState(currentMultiplier);
    const [customMultiplier, setCustomMultiplier] = useState<number | undefined>(undefined);
    const [isCustomMultiplierFocused, setIsCustomMultiplierFocused] = useState(false);

    const customMultiplierInputValue = (() => {
        if (isCustomMultiplierFocused) {
            return customMultiplier;
        }

        if (customMultiplier) {
            return `${customMultiplier} x`;
        }

        return '';
    })();

    const handleMultiplierClick = useCallback(
        (multiplier: number) => () => {
            setSelectedMultiplier(multiplier);
            if (customMultiplier) {
                setCustomMultiplier(undefined);
            }
        },
        [customMultiplier]
    );

    const handleCustomMultiplierChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const multiplier = e.target.value.includes('.') ? parseFloat(e.target.value) : parseInt(e.target.value);

        if (multiplier) {
            setSelectedMultiplier(multiplier);
            setCustomMultiplier(multiplier);
        } else {
            setSelectedMultiplier(1);
            setCustomMultiplier(undefined);
        }
    }, []);

    const handleCustomMultiplierFocus = useCallback(() => {
        setIsCustomMultiplierFocused(true);
    }, []);

    const handleCustomMultiplierBlur = useCallback(() => {
        setIsCustomMultiplierFocused(false);
    }, []);

    const handleResetScale = useCallback(() => {
        handleApply(1)();
    }, []);

    return (
        <section className={styles.modal}>
            <header className={styles.header}>
                <ScaleIcon />
                <h1>
                    Scale <span>Ingredients</span>
                </h1>
                <p className={styles.yield}>
                    {recipeYield.quantity.map((quantity) => round(quantity * selectedMultiplier, 0)).join(' - ')} {recipeYield.units}
                </p>
            </header>
            <div className={styles.options}>
                <div className={styles.multipliers}>
                    {MULTIPLIERS.map((multiplier) => (
                        <>
                            <button
                                data-active={!customMultiplier && selectedMultiplier === multiplier}
                                onClick={handleMultiplierClick(multiplier)}
                            >
                                <p>{multiplier} x</p>
                            </button>
                            <div className={styles.divider} />
                        </>
                    ))}
                    <input
                        placeholder="Custom"
                        type={isCustomMultiplierFocused ? 'number' : 'text'}
                        value={customMultiplierInputValue}
                        data-active={!!customMultiplier}
                        onChange={handleCustomMultiplierChange}
                        onFocus={handleCustomMultiplierFocus}
                        onBlur={handleCustomMultiplierBlur}
                    />
                </div>
            </div>
            <div className={styles.scrollContainer}>
                <ScrollWrapper height="100%" padding={0.75}>
                    <ul className={styles.ingredients}>
                        {ingredients.map((ingredient) => {
                            const Quantity = ingredient.quantity
                                ? ingredient.quantity.map((q) => mapDecimalToFraction(q * selectedMultiplier))
                                : null;
                            const qualifiers = [ingredient.prepStyles, ingredient.notes].filter((q) => !!q).join(', ');
                            return (
                                <li>
                                    <p>
                                        {ingredient.quantity && <span className={styles.quantity}>{Quantity}</span>}
                                        {ingredient.unit && <span className={styles.unit}>{ingredient.unit}</span>}
                                        <span className={styles.item}>
                                            {ingredient.item}
                                            {!!qualifiers && ','}
                                        </span>
                                        {!!qualifiers && <span className={styles.qualifiers}>{qualifiers}</span>}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </ScrollWrapper>
            </div>
            <div className={styles.buttons}>
                <button onClick={handleResetScale}>Reset</button>
                <button onClick={handleApply(selectedMultiplier)}>Apply</button>
                <button onClick={handleClose}>Cancel</button>
            </div>
        </section>
    );
};

export default ScaleIngredientsModal;

const mapDecimalToFraction = (number: number) => {
    const roundedDecimal = round(number, 3);

    const integer = Math.floor(roundedDecimal);
    const remainder = roundedDecimal - integer;

    if (!remainder) {
        return <>{integer}</>;
    }

    const fraction = DECIMAL_FRACTION_MAP.get(remainder);

    if (fraction) {
        if (integer) {
            return (
                <>
                    {integer} {fraction}
                </>
            );
        }

        return fraction;
    }

    return <>{roundedDecimal}</>;
};

const DECIMAL_FRACTION_MAP = new Map([
    [
        0.1,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>10</sub>
        </>
    ],
    [
        0.111,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>9</sub>
        </>
    ],
    [
        0.125,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>8</sub>
        </>
    ],
    [
        0.143,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>7</sub>
        </>
    ],
    [
        0.167,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>6</sub>
        </>
    ],
    [
        0.2,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>5</sub>
        </>
    ],
    [
        0.25,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>4</sub>
        </>
    ],
    [
        0.333,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>3</sub>
        </>
    ],
    [
        0.375,
        <>
            <sup className={styles.numerator}>3</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>8</sub>
        </>
    ],
    [
        0.4,
        <>
            <sup className={styles.numerator}>2</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>5</sub>
        </>
    ],
    [
        0.5,
        <>
            <sup className={styles.numerator}>1</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>2</sub>
        </>
    ],
    [
        0.6,
        <>
            <sup className={styles.numerator}>3</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>5</sub>
        </>
    ],
    [
        0.625,
        <>
            <sup className={styles.numerator}>5</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>8</sub>
        </>
    ],
    [
        0.667,
        <>
            <sup className={styles.numerator}>2</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>3</sub>
        </>
    ],
    [
        0.75,
        <>
            <sup className={styles.numerator}>3</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>4</sub>
        </>
    ],
    [
        0.8,
        <>
            <sup className={styles.numerator}>4</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>5</sub>
        </>
    ],
    [
        0.833,
        <>
            <sup className={styles.numerator}>5</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>6</sub>
        </>
    ],
    [
        0.875,
        <>
            <sup className={styles.numerator}>7</sup>
            <span className={styles.slash}>&frasl;</span>
            <sub className={styles.denominator}>8</sub>
        </>
    ]
]);