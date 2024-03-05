import { useCallback, useState } from 'react';
import { useRecipe } from '../../RecipeProvider';
import { isNull } from '@thymecard/types';
import styles from './nutrition.module.scss';

const Nutrition = () => {
    const { isEditing } = useRecipe();

    return <div className={styles.nutrition}>{isEditing ? <EditView /> : <DisplayView />}</div>;
};

export default Nutrition;

const DisplayView = () => {
    const { recipe } = useRecipe();

    const metrics = [
        ['ENERGY', recipe?.nutrition?.calories, ' kcal'],
        ['CARBS', recipe?.nutrition?.carbohydrate, 'g'],
        ['PROTEIN', recipe?.nutrition?.protein, 'g'],
        ['FAT', recipe?.nutrition?.fat, 'g']
    ] as const;

    return (
        <>
            {metrics.map(
                ([metric, value, unit]) =>
                    !!value && (
                        <div key={metric} className={styles.metric} data-metric={metric.toLowerCase()}>
                            <p className={styles.value}>
                                <span className={styles.num}>{value}</span>
                                <span className={styles.unit}>{unit}</span>
                            </p>
                            <p className={styles.name}>{metric}</p>
                        </div>
                    )
            )}
        </>
    );
};

const EditView = () => {
    const { nutrition } = useRecipe();
    const [focusIndices, setFocusIndices] = useState<number[]>([]);

    const metrics = [
        { key: 'calories', label: 'ENERGY', value: nutrition.edit.calories, unit: ' kcal' },
        { key: 'carbohydrate', label: 'CARBS', value: nutrition.edit.carbohydrate, unit: 'g' },
        { key: 'protein', label: 'PROTEIN', value: nutrition.edit.protein, unit: 'g' },
        { key: 'fat', label: 'FAT', value: nutrition.edit.fat, unit: 'g' }
    ] as const;

    const handleFocus = (index: number) => () => {
        setFocusIndices((prev) => [...prev, index]);
    };

    const handleBlur = (index: number) => () => {
        setFocusIndices((prev) => prev.filter((i) => i !== index));
    };

    const determineInputValue = useCallback((value: number | null, unit: string, isFocused: boolean) => {
        if (isNull(value)) {
            return '';
        }

        if (isFocused) {
            return `${value}`;
        }

        return `${value}${unit}`;
    }, []);

    return (
        <>
            {metrics.map(({ key, label, value, unit }, i) => {
                const isFocused = focusIndices.includes(i);
                const inputPadding = key === 'calories' ? 3 : 1;

                return (
                    <div key={key} className={styles.metric} data-metric={label.toLowerCase()}>
                        <input
                            className={styles.edit}
                            type={isFocused ? 'number' : 'text'}
                            value={determineInputValue(value, unit, isFocused)}
                            placeholder="#"
                            data-empty={isNull(value)}
                            style={{ width: `${(value ?? 0).toString().length + inputPadding}ch` }}
                            onChange={nutrition.handleChange(key)}
                            onFocus={handleFocus(i)}
                            onBlur={handleBlur(i)}
                        />
                        <p className={styles.name}>{label}</p>
                    </div>
                );
            })}
        </>
    );
};
