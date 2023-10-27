import { FC } from 'react';
import { DateTime } from 'luxon';
import { collateRecipeTags } from '@/lib/recipe.utils';
import styles from './metadata.module.scss';
import { useRecipe } from '../RecipeProvider';
import Serving from './Yield/Yield';
import Time from './Time/Time';
import Rating from './Rating/Rating';
import LastCooked from './LastCooked/LastCooked';
import Tags from './Tags/Tags';
import Authors from './Authors/Authors';
import Source from './Source/Source';
import Nutrition from './Nutrition/Nutrition';

interface IMetadataProps {
    scale: number;
}

const Metadata: FC<IMetadataProps> = ({ scale }) => {
    const { recipe, isEditing } = useRecipe();

    if (!recipe) {
        return null;
    }

    const tags = collateRecipeTags(recipe);

    const shouldRender = {
        authors: !!recipe.authors || isEditing,
        source: !!recipe.source || isEditing,
        prepTime: !!recipe.prepTime || isEditing,
        cookTime: !!recipe.cookTime || isEditing,
        totalTime: !!recipe.totalTime || isEditing,
        added: !!recipe.createdAt,
        lastCooked: !!recipe.lastCooked || isEditing,
        nutrition: !!recipe.nutrition?.calories || isEditing,
        tags: !!tags.length || isEditing
    };

    const createdAt = recipe.createdAt ? DateTime.fromISO(recipe.createdAt).toFormat('MMMM d, yyyy') : undefined;

    return (
        <>
            <div className={styles.details}>
                <div className={styles.origin}>
                    {shouldRender.authors && <Authors />}
                    {shouldRender.source && <Source />}
                </div>
                {(shouldRender.authors || shouldRender.source) && <div className={styles.divider} />}
                <ul className={styles.metrics}>
                    <li>
                        <p className={styles.metric}>SERVES</p>
                        <Serving scale={scale} />
                    </li>
                    <div className={styles.divider} />
                    {shouldRender.prepTime && (
                        <li>
                            <p className={styles.metric}>PREP</p> <Time type="prep" />
                        </li>
                    )}
                    {shouldRender.cookTime && (
                        <li>
                            <p className={styles.metric}>COOK</p> <Time type="cook" />
                        </li>
                    )}
                    {shouldRender.totalTime && (
                        <li>
                            <p className={styles.metric}>TOTAL</p> <Time type="total" />
                        </li>
                    )}
                    {(shouldRender.prepTime || shouldRender.cookTime || shouldRender.totalTime) && <div className={styles.divider} />}
                    <li className={styles.rating}>
                        <p className={styles.metric}>RATING</p> <Rating />
                    </li>
                    <div className={styles.divider} />
                    {shouldRender.added && (
                        <li>
                            <p className={styles.metric}>ADDED</p> <p className={styles.value}>{createdAt}</p>
                        </li>
                    )}
                    {shouldRender.lastCooked && (
                        <li className={styles.lastCooked}>
                            <p className={styles.metric}>COOKED</p>
                            <LastCooked />
                        </li>
                    )}
                </ul>
                {shouldRender.tags && (
                    <>
                        <div className={styles.divider} />
                        <Tags />
                    </>
                )}
                {shouldRender.nutrition && (
                    <>
                        <div className={styles.divider} />
                        <Nutrition />
                    </>
                )}
            </div>
        </>
    );
};

export default Metadata;
