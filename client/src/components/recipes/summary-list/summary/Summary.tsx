import { FC, Fragment, useMemo } from 'react';
import { Duration } from 'luxon';

import Tooltip from '@/components/common/tooltip/Tooltip';

import { ICONS } from '@/assets/icons';
import { Client, IRecipeSummary } from '@thymecard/types';
import { collateRecipeTags } from '@/lib/recipe.utils';
import { buildRecipeImageUrl } from '@/lib/s3/s3.utils';
import { formatClasses } from '@/lib/common.utils';

import styles from './summary.module.scss';

const ServingsIcon = ICONS.recipes.servings;
const PrepTimeIcon = ICONS.recipes.prepTime;
const CookTimeIcon = ICONS.recipes.cookTime;
const TotalTimeIcon = ICONS.recipes.totalTime;
const BookmarkIcon = ICONS.recipes.bookmarkFill;
const IngredientsIcon = ICONS.recipes.tickList;
const CaloriesIcon = ICONS.common.pieChart;
const StarIcon = ICONS.common.star;

interface ISummaryProps {
    recipe: Client<IRecipeSummary>;
    selectedTags: string[];
    handleSelectRecipe: (recipeId: string) => void;
    handleTagClick: (tag: string) => void;
}

const Summary: FC<ISummaryProps> = ({ recipe, selectedTags, handleSelectRecipe, handleTagClick }) => {
    const tags = useMemo(() => collateRecipeTags(recipe), [recipe]);
    const orderedTags = useMemo(
        () => [...selectedTags, ...tags.filter((tag) => !selectedTags.includes(tag.name)).map((tag) => tag.name)],
        [selectedTags, tags]
    );

    const imageUrl = buildRecipeImageUrl(recipe.image);

    const details = [
        {
            name: 'servings',
            label: 'Servings',
            value: recipe.yield.quantity.join(' - ').toString(),
            icon: <ServingsIcon />,
            display: true
        },
        {
            name: 'prepTime',
            label: 'Prep Time',
            value: Duration.fromObject({ minutes: recipe.prepTime }).toFormat('h:mm'),
            icon: <PrepTimeIcon />,
            display: !!recipe.prepTime
        },
        {
            name: 'cookTime',
            label: 'Cook Time',
            value: recipe.cookTime ? Duration.fromObject({ minutes: recipe.cookTime }).toFormat('h:mm') : undefined,
            icon: <CookTimeIcon />,
            display: !!recipe.cookTime
        },
        {
            name: 'totalTime',
            label: 'Total Time',
            value: recipe.totalTime ? Duration.fromObject({ minutes: recipe.totalTime }).toFormat('h:mm') : undefined,
            icon: <TotalTimeIcon />,
            display: !!recipe.totalTime && !((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) === recipe.totalTime)
        },
        {
            name: 'ingredientsCount',
            label: 'Ingredients',
            value: recipe.ingredientsCount.toString(),
            icon: <IngredientsIcon />,
            display: true
        },
        {
            name: 'calories',
            label: 'Calories',
            value: recipe.calories?.toString() + ' kcal',
            icon: <CaloriesIcon />,
            display: !!recipe.calories
        },
        {
            name: 'rating',
            label: 'Rating',
            value: recipe.rating?.toString(),
            icon: <StarIcon />,
            display: !!recipe.rating
        }
    ];

    return (
        <li key={recipe._id} className={styles.listItem}>
            <div className={styles.image}>
                <img src={imageUrl ? imageUrl : ''} alt={`Image of ${name}`} />
            </div>
            <div className={styles.text}>
                <span className={styles.topLine}>
                    <button onClick={() => handleSelectRecipe(recipe._id)}>
                        <h1 className={styles.title}>{recipe.title}</h1>
                    </button>
                    {recipe.isBookmarked && <BookmarkIcon />}
                </span>
                <Details recipeId={recipe._id} details={details} />
                <div className={styles.tags}>
                    {orderedTags.map((tag) => (
                        <button key={`${recipe._id}${tag}`} data-selected={selectedTags.includes(tag)} onClick={() => handleTagClick(tag)}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </li>
    );
};

export default Summary;

interface IDetail {
    name: string;
    label: string;
    value?: string;
    icon: JSX.Element;
    display: boolean;
}

interface IDetailsProps {
    recipeId: string;
    details: IDetail[];
}

const Details: FC<IDetailsProps> = ({ recipeId, details }) => {
    return (
        <ul className={styles.details}>
            {details
                .filter((detail) => detail.display)
                .map((detail, index) => (
                    <Fragment key={`${recipeId}${detail.name}`}>
                        <li
                            className={formatClasses(styles, ['detail', detail.name])}
                            data-tooltip-id={`summary-${detail.name}`}
                            data-tooltip-content={`${detail.label}`}
                        >
                            {index !== 0 && <div className={styles.divider} />}
                            {detail.icon}
                            <p>{detail.value}</p>
                        </li>
                        <Tooltip id={`summary-${detail.name}`} size="small" place="bottom" offset={10} />
                    </Fragment>
                ))}
        </ul>
    );
};
