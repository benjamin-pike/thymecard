import { FC } from 'react';
import styles from './method-display.module.scss';
import { useRecipe } from '../RecipeProvider';

interface IRecipeMethodDisplayProps {
    isPrintLayout: boolean;
    isIngredientsVisible: boolean;
}

const MethodDisplay: FC<IRecipeMethodDisplayProps> = ({ isPrintLayout, isIngredientsVisible }) => {
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    return (
        <ul className={styles.method} data-print={isPrintLayout} data-ingredients-visible={isIngredientsVisible}>
            {recipe.method?.map((section, i) => (
                <li key={i} className={styles.section}>
                    {section.sectionTitle && <h3 className={styles.sectionTitle}>{section.sectionTitle}</h3>}
                    {(section.sectionTitle || (!section.sectionTitle && i !== 0)) && <div className={styles.divider} />}
                    <ol className={styles.steps}>
                        {section.steps.map((step, j) => (
                            <li key={j} className={styles.step} data-number={`${j + 1}.`}>
                                {step.stepTitle && <h4 className={styles.stepTitle}>{step.stepTitle}</h4>}
                                <p>{step.instructions}</p>
                            </li>
                        ))}
                    </ol>
                </li>
            ))}
        </ul>
    );
};

export default MethodDisplay;
