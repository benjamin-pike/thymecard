import { FC, Fragment } from 'react';
import { Duration } from 'luxon';
import { formatClasses } from '@/lib/common.utils';
import { isDefined } from '@/lib/type.utils';
import styles from './list-entry.module.scss';
import { MaterialSymbol } from '@/lib/material-symbols/MaterialSymbol';
import { ICONS } from '@/assets/icons';
import { numberToStars } from '@/lib/elements.utils';

const ServingsIcon = ICONS.recipes.servings;
const PrepTimeIcon = ICONS.recipes.prepTime;
const BookmarkIcon = ICONS.recipes.bookmarkFill;

interface IListEntryProps {
    id: string;
    name: string;
    imageUrl: string;
    servings?: number;
    prepTime?: number;
    cookTime?: number;
    rating?: number;
    bookmarked?: boolean;
    tags: string[];
    selectedTags: string[];
    handleSelectRecipe: (recipeId: string) => void;
    handleTagClick: (tag: string) => void;
}

const ListEntry: FC<IListEntryProps> = ({
    id,
    name,
    imageUrl,
    servings,
    prepTime,
    cookTime,
    rating,
    bookmarked,
    tags,
    selectedTags,
    handleSelectRecipe,
    handleTagClick
}) => {
    const orderedTags = [...selectedTags, ...tags.filter((tag) => !selectedTags.includes(tag))];

    const details = [
        {
            name: 'servings',
            value: servings?.toString(),
            icon: <ServingsIcon />
        },
        {
            name: 'prepTime',
            value: Duration.fromObject({ minutes: prepTime }).toFormat('h:mm'),
            icon: <PrepTimeIcon />
        },
        {
            name: 'cookTime',
            value: Duration.fromObject({ minutes: cookTime }).toFormat('h:mm'),
            icon: <MaterialSymbol icon="oven_gen" style="outlined" />
        }
    ];

    return (
        <li key={id} className={styles.listItem}>
            <div className={styles.image}>
                <img src={imageUrl} alt={`Image of ${name}`} />
            </div>
            <div className={styles.text}>
                <span className={styles.topLine}>
                    <button onClick={() => handleSelectRecipe(id)}>
                        <h1 className={styles.title}>{name}</h1>
                    </button>
                    {bookmarked && <BookmarkIcon />}
                </span>
                <Details recipeId={id} details={details} rating={rating} />
                <div className={styles.tags}>
                    {orderedTags.map((tag) => (
                        <button key={`${id}${tag}`} data-selected={selectedTags.includes(tag)} onClick={() => handleTagClick(tag)}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </li>
    );
};

export default ListEntry;

interface IDetail {
    name: string;
    value?: string;
    icon: JSX.Element;
}

interface IDetailsProps {
    recipeId: string;
    details: IDetail[];
    rating?: number;
}

const Details: FC<IDetailsProps> = ({ recipeId, details, rating }) => {
    return (
        <ul className={styles.details}>
            {details.map(
                (detail, index) =>
                    isDefined(detail.value) && (
                        <Fragment key={`${recipeId}${detail.name}`}>
                            <li className={formatClasses(styles, ['detail', detail.name])}>
                                {detail.icon}
                                <p>{detail.value}</p>
                            </li>
                            {index !== details.length - 1 && <div className={styles.divider} />}
                        </Fragment>
                    )
            )}
            {isDefined(rating) && (
                <>
                    <div className={styles.divider} />
                    <li className={formatClasses(styles, ['detail', 'rating'])}>{numberToStars(rating)}</li>
                </>
            )}
        </ul>
    );
};
