import { FC, useMemo } from 'react';
import { useRecipe } from '../../../../providers/RecipeProvider';
import { numberToStars } from '@/lib/elements.utils';
import { isNull } from '@thymecard/types';
import styles from './rating.module.scss';

const Rating: FC = () => {
    const { isEditing } = useRecipe();

    return isEditing ? <EditView /> : <DisplayView />;
};

export default Rating;

const EditView: FC = () => {
    const { recipe, rating } = useRecipe();

    const Stars = useMemo(() => numberToStars(rating.edit ?? 0).map((Star, i) => <Star key={i} className={styles.star} />), [rating]);

    if (!recipe) {
        return null;
    }

    return (
        <div className={styles.edit} data-defined={!isNull(rating.edit)}>
            <input
                type="number"
                value={rating.edit ?? ''}
                min={0}
                max={5}
                step={0.5}
                placeholder="#"
                style={{ width: '2.5ch' }}
                onChange={rating.handleChange}
            />
            {Stars}
        </div>
    );
};

const DisplayView: FC = () => {
    const { recipe } = useRecipe();

    const Stars = useMemo(() => numberToStars(recipe?.rating ?? 0).map((Star, i) => <Star className={styles.star} key={i} />), [recipe]);

    if (!recipe) {
        return null;
    }

    return (
        <span className={styles.value} data-defined={!isNull(recipe.rating)}>
            {Stars}
        </span>
    );
};
