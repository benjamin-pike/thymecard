import { FC } from 'react';
import { formatClasses } from '@/lib/common.utils';
import styles from './simple-nutrients.module.scss';

interface ISimpleNutrientsProps {
    isVisible: boolean;
    energy: number;
    carbohydrates: number;
    protein: number;
    fat: number;
    sodium: number;
}

const SimpleNutrients: FC<ISimpleNutrientsProps> = ({ isVisible, energy, carbohydrates, protein, fat, sodium }) => {
    return (
        <div className={styles.wrapper} data-active={isVisible}>
            <div className={styles.container}>
                <div className={styles.chips}>
                    <p
                        data-metric="energy"
                        style={{ width: `calc(2.75rem + ${energy.toString().length - 0.5}ch)` }}
                        data-tooltip-id="energy"
                        data-tooltip-content="Energy"
                    >
                        <span className={styles.value}>{energy}</span>
                        <span className={styles.unit}> kcal</span>
                    </p>
                    <div className={formatClasses(styles, ['divider', 'vertical'])}></div>
                    <p
                        data-metric="carbs"
                        style={{ width: `calc(1.85rem + ${carbohydrates.toString().length - 0.5}ch)` }}
                        data-tooltip-id="carbs"
                        data-tooltip-content="Carbohydrates"
                    >
                        <span className={styles.value}>{carbohydrates}</span>
                        <span className={styles.unit}>g</span>
                    </p>
                    <p
                        data-metric="protein"
                        style={{ width: `calc(1.85rem + ${protein.toString().length - 0.5}ch)` }}
                        data-tooltip-id="protein"
                        data-tooltip-content="Protein"
                    >
                        <span className={styles.value}>{protein}</span>
                        <span className={styles.unit}>g</span>
                    </p>
                    <p
                        data-metric="fat"
                        style={{ width: `calc(1.85rem + ${fat.toString().length - 0.5}ch)` }}
                        data-tooltip-id="fat"
                        data-tooltip-content="Fat"
                    >
                        <span className={styles.value}>{fat}</span>
                        <span className={styles.unit}>g</span>
                    </p>
                    <p
                        data-metric="minerals"
                        style={{ width: `calc(2.25rem + ${sodium.toString().length - 0.5}ch)` }}
                        data-tooltip-id="sodium"
                        data-tooltip-content="Sodium"
                    >
                        <span className={styles.value}>{sodium}</span>
                        <span className={styles.unit}>mg</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SimpleNutrients;
