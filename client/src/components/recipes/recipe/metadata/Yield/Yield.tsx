import { FC } from 'react';
import { useRecipe } from '../../RecipeProvider';
import styles from './yield.module.scss';

interface IYieldProps {
    scale: number;
}

const Yield: FC<IYieldProps> = (props) => {
    const { isEditing } = useRecipe();

    return isEditing ? <EditView /> : <DisplayView {...props} />;
};

export default Yield;

const EditView = () => {
    const { recipe, recipeYield, isIncomplete } = useRecipe();

    const isError = !recipeYield.edit.quantity && isIncomplete;

    if (!recipe) {
        return null;
    }

    return (
        <div className={styles.edit}>
            <p className={styles.quantity} contentEditable placeholder="#" data-error={isError} onBlur={recipeYield.handleQuantityBlur}>
                {recipeYield.edit.quantity}
            </p>
            <input
                className={styles.units}
                value={recipeYield.edit.units}
                placeholder="unit (eg. people)"
                onChange={recipeYield.handleUnitsChange}
            />
        </div>
    );
};

const DisplayView: FC<IYieldProps> = ({ scale }) => {
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    return (
        <>
            <p className={styles.value}>
                {recipe.yield?.quantity.map((q) => q * scale).join(' - ')} {recipe.yield?.units}
            </p>
            {scale !== 1 && <p className={styles.scale}>{scale}x</p>}
        </>
    );
};
