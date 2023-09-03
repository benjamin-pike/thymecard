import { FC, useCallback } from 'react';
import { useToggle } from '@mantine/hooks';
import { round } from '@/lib/number.utils';
import { INutrients } from '@/types/recipe.types';
import styles from './detailed-nutrients.module.scss';

interface IDetailedNutrientsProps {
    isVisible: boolean;
    values: INutrients;
}

const DetailedNutrients: FC<IDetailedNutrientsProps> = ({ isVisible, values }) => {
    const [displayChildren, toggleChildren] = useToggle([false, true]);

    const handleToggleChildren = useCallback(() => {
        toggleChildren();
    }, []);

    const data = format(values);
    const mandatoryFields = ['Carbohydrates', 'Protein', 'Fat'];

    const orders = {
        kcal: 1,
        g: 1,
        mg: 1000,
        µg: 1000000
    };

    const visibleBlocks = {
        energy: true,
        carbs: true,
        protein: true,
        fat: true,
        minerals: !!data.find((item) => item.metric === 'minerals')?.elements.some(({ value, unit }) => !!round(value * orders[unit], 1)),
        vitamins: !!data.find((item) => item.metric === 'vitamins')?.elements.some(({ value, unit }) => !!round(value * orders[unit], 1)),
        pregnancy: !!data.find((item) => item.metric === 'pregnancy')?.elements.some(({ value, unit }) => !!round(value * orders[unit], 1))
    };

    return (
        <div className={styles.wrapper} data-active={isVisible}>
            <div className={styles.container}>
                <ul>
                    {data.map(({ metric, elements }) => {
                        console.log(metric, elements, visibleBlocks[metric]);
                        if (!visibleBlocks[metric]) return null;

                        return (
                            <li data-metric={metric}>
                                {elements.map(({ title, value, unit, percentage, isSub, children }) => {
                                    const scaledValue = round(value * orders[unit], 1);

                                    if (!(mandatoryFields.includes(title) || !!scaledValue)) {
                                        return null;
                                    }

                                    return !children ? (
                                        <p className={isSub ? styles.sub : ''}>
                                            <span className={styles.nutrient}>{title}</span>
                                            <span className={styles.value}>{scaledValue}</span>
                                            <span className={styles.unit}>{unit}</span>
                                            <span className={styles.percentage}>{round(percentage, 1)}%</span>
                                        </p>
                                    ) : (
                                        <>
                                            <p className={styles.parent}>
                                                <span className={styles.nutrient}>
                                                    {title}
                                                    <span role="button" onClick={handleToggleChildren}>
                                                        {' '}
                                                        ...
                                                    </span>
                                                </span>
                                                <span className={styles.value}>{round(value * orders[unit], 1)}</span>
                                                <span className={styles.unit}>{unit}</span>
                                                <span className={styles.percentage}>{round(percentage, 1)}</span>
                                            </p>
                                            <div className={styles.childrenWrapper} data-active={displayChildren}>
                                                <div className={styles.children}>
                                                    {children.map(({ title, value, unit, percentage }) => {
                                                        const scaledChildValue = round(value * orders[unit], 1);

                                                        if (!scaledChildValue) return null;

                                                        return (
                                                            <p className={styles.sub}>
                                                                <span className={styles.nutrient}>{title}</span>
                                                                <span className={styles.value}>{round(scaledChildValue, 1)}</span>
                                                                <span className={styles.unit}>{unit}</span>
                                                                <span className={styles.percentage}>{round(percentage, 1)}%</span>
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

interface Data {
    metric: 'energy' | 'carbs' | 'protein' | 'fat' | 'minerals' | 'vitamins' | 'pregnancy';
    elements: {
        title: string;
        value: number;
        unit: 'kcal' | 'g' | 'mg' | 'µg';
        percentage: number;
        isSub: boolean;
        children?: {
            title: string;
            value: number;
            unit: 'kcal' | 'g' | 'mg' | 'µg';
            percentage: number;
        }[];
    }[];
}

const format = (values: INutrients): Data[] => [
    {
        metric: 'energy',
        elements: [
            { title: 'Energy', value: values.energy, unit: 'kcal', percentage: 24, isSub: false },
            {
                title: 'Carbohydrates',
                value: values.carbohydrates,
                unit: 'kcal',
                percentage: (100 * 4 * values.carbohydrates) / (4 * values.carbohydrates + 4 * values.protein + 9 * values.fat),
                isSub: true
            },
            {
                title: 'Protein',
                value: values.protein,
                unit: 'kcal',
                percentage: (100 * 4 * values.protein) / (4 * values.carbohydrates + 4 * values.protein + 9 * values.fat),
                isSub: true
            },
            {
                title: 'Fat',
                value: values.fat,
                unit: 'kcal',
                percentage: (100 * 9 * values.fat) / (4 * values.carbohydrates + 4 * values.protein + 9 * values.fat),
                isSub: true
            }
        ]
    },
    {
        metric: 'carbs',
        elements: [
            { title: 'Carbohydrates', value: values.carbohydrates, unit: 'g', percentage: 0, isSub: false },
            { title: 'Sugars', value: values.sugars ?? 0, unit: 'g', percentage: 0, isSub: true },
            { title: 'Fiber', value: values.fiber ?? 0, unit: 'g', percentage: 0, isSub: true }
        ]
    },
    {
        metric: 'protein',
        elements: [{ title: 'Protein', value: values.protein, unit: 'g', percentage: 14.2, isSub: false }]
    },
    {
        metric: 'fat',
        elements: [
            { title: 'Fat', value: values.fat, unit: 'g', percentage: 7.4, isSub: false },
            { title: 'Saturated Fat', value: values.saturatedFat ?? 0, unit: 'g', percentage: 0, isSub: true },
            { title: 'Cholesterol', value: values.cholesterol ?? 0, unit: 'mg', percentage: 0, isSub: true }
        ]
    },
    {
        metric: 'minerals',
        elements: [
            { title: 'Sodium', value: values.sodium ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Potassium', value: values.potassium ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Calcium', value: values.calcium ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Magnesium', value: values.magnesium ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Iron', value: values.iron ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Zinc', value: values.zinc ?? 0, unit: 'mg', percentage: 0, isSub: false }
        ]
    },
    {
        metric: 'vitamins',
        elements: [
            { title: 'Vitamin A', value: values.vitaminA ?? 0, unit: 'µg', percentage: 0, isSub: false },
            {
                title: 'Vitamin B',
                value:
                    (values.vitaminB1 ?? 0) +
                    (values.vitaminB2 ?? 0) +
                    (values.vitaminB3 ?? 0) +
                    (values.vitaminB5 ?? 0) +
                    (values.vitaminB6 ?? 0) +
                    (values.vitaminB9 ?? 0) +
                    (values.vitaminB12 ?? 0),
                unit: 'mg',
                percentage: 0,
                isSub: false,
                children: [
                    { title: 'Vitamin B1', value: values.vitaminB1 ?? 0, unit: 'mg', percentage: 0 },
                    { title: 'Vitamin B2', value: values.vitaminB2 ?? 0, unit: 'mg', percentage: 0 },
                    { title: 'Vitamin B3', value: values.vitaminB3 ?? 0, unit: 'mg', percentage: 0 },
                    { title: 'Vitamin B5', value: values.vitaminB5 ?? 0, unit: 'mg', percentage: 0 },
                    { title: 'Vitamin B6', value: values.vitaminB6 ?? 0, unit: 'mg', percentage: 0 },
                    { title: 'Vitamin B9', value: values.vitaminB9 ?? 0, unit: 'µg', percentage: 0 },
                    { title: 'Vitamin B12', value: values.vitaminB12 ?? 0, unit: 'µg', percentage: 0 }
                ]
            },
            { title: 'Vitamin C', value: values.vitaminC ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Vitamin D', value: values.vitaminD ?? 0, unit: 'µg', percentage: 0, isSub: false },
            { title: 'Vitamin E', value: values.vitaminE ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Vitamin K', value: values.vitaminK ?? 0, unit: 'µg', percentage: 0, isSub: false }
        ]
    },
    {
        metric: 'pregnancy',
        elements: [
            { title: 'Caffeine', value: values.caffeine ?? 0, unit: 'mg', percentage: 0, isSub: false },
            { title: 'Alcohol', value: values.alcohol ?? 0, unit: 'g', percentage: 0, isSub: false }
        ]
    }
];

export default DetailedNutrients;
