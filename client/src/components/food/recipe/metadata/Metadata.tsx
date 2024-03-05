import { FC } from 'react';
import { DateTime } from 'luxon';

import Yield from './Yield/Yield';
import Time from './Time/Time';
import Rating from './Rating/Rating';
import LastCooked from './LastCooked/LastCooked';
import Tags from './Tags/Tags';
import Authors from './Authors/Authors';
import Source from './Source/Source';
import Nutrition from './Nutrition/Nutrition';
import TextSkeleton from '@/components/common/loading-skeleton/TextSkeleton';

import { useRecipe } from '../RecipeProvider';

import { collateRecipeTags } from '@/lib/recipe.utils';
import { ICONS } from '@/assets/icons';

import styles from './metadata.module.scss';

const ServingsIcon = ICONS.recipes.servings;
const PrepTimeIcon = ICONS.recipes.prepTime;
const CookTimeIcon = ICONS.recipes.cookTime;
const TotalTimeIcon = ICONS.recipes.totalTime;
const RatingIcon = ICONS.common.star;
const AddedIcon = ICONS.common.planner;
const LastCookedIcon = ICONS.common.planner;

interface IMetadataProps {
    scale: number;
}

const Metadata: FC<IMetadataProps> = ({ scale }) => {
    const { recipe, isLoading, isEditing } = useRecipe();

    const tags = collateRecipeTags(recipe ?? {});

    const shouldRender = {
        authors: !!recipe.authors.length || isEditing,
        source: !!recipe.source || isEditing,
        prepTime: !!recipe.prepTime || isEditing,
        cookTime: !!recipe.cookTime || isEditing,
        totalTime: !!recipe.totalTime || isEditing,
        added: !!recipe.createdAt,
        lastCooked: !!recipe.lastCooked || isEditing,
        nutrition: !!recipe.nutrition?.calories || isEditing,
        tags: !!tags.length || isEditing
    };

    const createdAt = recipe?.createdAt ? DateTime.fromISO(recipe.createdAt).toFormat('MMMM d, yyyy') : undefined;

    return (
        <>
            <div className={styles.details} data-editing={isEditing}>
                {isLoading ? (
                    <>
                        <TextSkeleton fontSize={1} width="100%" />
                        <TextSkeleton fontSize={0.75} width="70%" />
                        <div className={styles.divider} />
                    </>
                ) : (
                    <>
                        <div className={styles.origin}>
                            {shouldRender.authors && <Authors />}
                            {shouldRender.source && <Source />}
                        </div>
                        {(shouldRender.authors || shouldRender.source) && <div className={styles.divider} />}
                    </>
                )}
                {isLoading ? (
                    <>
                        <TextSkeleton fontSize={1} width="100%" />
                        <TextSkeleton fontSize={1} width="90%" />
                        <TextSkeleton fontSize={1} width="70%" />
                        <div className={styles.divider} />
                        <TextSkeleton fontSize={1} width="100%" />
                        <div className={styles.divider} />
                        <TextSkeleton fontSize={1} width="100%" />
                        <TextSkeleton fontSize={1} width="75%" />
                    </>
                ) : (
                    <ul className={styles.metrics}>
                        <li>
                            <ServingsIcon className={styles.icon} />
                            <p className={styles.metric}>SERVES</p>
                            <Yield scale={scale} />
                        </li>
                        {shouldRender.prepTime && (
                            <li>
                                <PrepTimeIcon className={styles.icon} />
                                <p className={styles.metric}>PREP</p> <Time type="prep" />
                            </li>
                        )}
                        {shouldRender.cookTime && (
                            <li>
                                <CookTimeIcon className={styles.icon} />
                                <p className={styles.metric}>COOK</p> <Time type="cook" />
                            </li>
                        )}
                        {shouldRender.totalTime && (
                            <li className={styles.totalTime}>
                                <TotalTimeIcon className={styles.icon} />
                                <p className={styles.metric}>TOTAL</p> <Time type="total" />
                            </li>
                        )}
                        <li className={styles.rating}>
                            <RatingIcon className={styles.icon} />
                            <p className={styles.metric}>RATING</p> <Rating />
                        </li>
                        {shouldRender.added && (
                            <li>
                                <AddedIcon className={styles.icon} />
                                <p className={styles.metric}>ADDED</p> <p className={styles.value}>{createdAt}</p>
                            </li>
                        )}
                        {shouldRender.lastCooked && (
                            <li className={styles.lastCooked}>
                                <LastCookedIcon className={styles.icon} />
                                <p className={styles.metric}>COOKED</p>
                                <LastCooked />
                            </li>
                        )}
                    </ul>
                )}
                {isLoading ? (
                    <>
                        <div className={styles.tagsLoading}>
                            <TextSkeleton fontSize={1.25} width="calc(35% - 0.25rem)" />
                            <TextSkeleton fontSize={1.25} width="calc(65% - 0.25rem)" />
                            <TextSkeleton fontSize={1.25} width="calc(25% - 0.34rem)" />
                            <TextSkeleton fontSize={1.25} width="calc(45% - 0.34rem)" />
                            <TextSkeleton fontSize={1.25} width="calc(30% - 0.34rem)" />
                        </div>
                    </>
                ) : (
                    shouldRender.tags && (
                        <>
                            {isEditing && <div className={styles.divider} />}
                            <Tags />
                        </>
                    )
                )}
                {isLoading ? (
                    <>
                        <div className={styles.tagsLoading}>
                            <TextSkeleton fontSize={1.75} width="5rem" />
                            <TextSkeleton fontSize={1.75} width="3.25rem" />
                            <TextSkeleton fontSize={1.75} width="4rem" />
                            <TextSkeleton fontSize={1.75} width="3.5rem" />
                        </div>
                    </>
                ) : (
                    shouldRender.nutrition && (
                        <>
                            <Nutrition />
                        </>
                    )
                )}
            </div>
        </>
    );
};

export default Metadata;
