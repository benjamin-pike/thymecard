import { FC } from 'react';
import { useRecipe } from '../RecipeProvider';
import { round } from '@/lib/number.utils';
import styles from './ingredients-display.module.scss';
import { buildKey } from '@sirona/utils';
import { isNumber } from '@sirona/types';
import { capitalize } from '@/lib/string.utils';

interface IRecipeIngredientsDisplayProps {
    addedIngredients: Set<number>;
    scale: number;
    isPrintLayout: boolean;
    handleIngredientsClick: (i: number) => () => void;
}

const IngredientsDisplay: FC<IRecipeIngredientsDisplayProps> = ({ addedIngredients, scale, isPrintLayout, handleIngredientsClick }) => {
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    return (
        <ul className={styles.ingredients} data-print={isPrintLayout}>
            {recipe.ingredients?.map((ingredient, i) => {
                const Quantity = ingredient.quantity
                    ? ingredient.quantity.reduce<JSX.Element[]>((acc, quantity, i) => {
                          const fraction = mapDecimalToFraction(quantity * scale);

                          if (i === 1) {
                              acc.push(<span className={styles.plus}> - </span>);
                          }

                          acc.push(fraction);
                          return acc;
                      }, [])
                    : null;
                const item = Quantity || ingredient.unit ? ingredient.item : capitalize(ingredient.item);
                const supplementaryInfo = [ingredient.prepStyles, ingredient.notes].filter((q) => !!q).join(', ');

                return (
                    <li key={buildKey(recipe._id, 'ingredients-edit', i)} onClick={handleIngredientsClick(i)}>
                        <p data-added={addedIngredients.has(i)}>
                            {!!ingredient.quantity && (
                                <span key={buildKey(recipe._id, 'quantity', ingredient.quantity, i)} className={styles.quantity}>
                                    {Quantity}
                                    {!ingredient.unit && isNumber(parseInt(ingredient.item[0])) && <span className={styles.x}>{'x'}</span>}
                                </span>
                            )}
                            {!!ingredient.unit && (
                                <span key={buildKey(recipe._id, 'unit', ingredient.unit, i)} className={styles.unit}>
                                    {ingredient.unit}
                                </span>
                            )}
                            <span key={buildKey(recipe._id, 'item', ingredient.item, i)} className={styles.item}>
                                {item}
                                {!!supplementaryInfo && ','}
                            </span>
                            {!!supplementaryInfo && (
                                <span
                                    key={buildKey(recipe._id, 'supplementaryInfo', supplementaryInfo, i)}
                                    className={styles.supplementaryInfo}
                                >
                                    {supplementaryInfo}
                                </span>
                            )}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
};

export default IngredientsDisplay;

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
