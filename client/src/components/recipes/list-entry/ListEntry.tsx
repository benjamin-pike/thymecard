import { FC } from 'react';
import { Duration } from 'luxon';
import { PiBookmarkSimpleFill, PiCookingPotBold, PiForkKnifeBold, PiKnifeFill } from 'react-icons/pi';
import { AiOutlineStar } from 'react-icons/ai';
import { formatClasses } from '@/lib/common.utils';
import { isDefined } from '@/lib/type.utils';
import styles from './list-entry.module.scss';

interface IListEntryProps {
    name: string;
    imageUrl: string;
    servings?: number;
    prepTime?: number;
    cookTime?: number;
    rating?: number;
    bookmarked?: boolean;
    tags: string[];
    selectedTags: string[];
    handleTagClick: (tag: string) => void;
}

const ListEntry: FC<IListEntryProps> = ({
    name,
    imageUrl,
    servings,
    prepTime,
    cookTime,
    rating,
    bookmarked,
    tags,
    selectedTags,
    handleTagClick
}) => {
    const orderedTags = [...selectedTags, ...tags.filter((tag) => !selectedTags.includes(tag))];

    const details = [
        {
            name: 'servings',
            value: servings?.toString(),
            icon: <PiForkKnifeBold />
        },
        {
            name: 'prepTime',
            value: Duration.fromObject({ minutes: prepTime }).toFormat('h:mm'),
            icon: <PiKnifeFill />
        },
        {
            name: 'cookTime',
            value: Duration.fromObject({ minutes: cookTime }).toFormat('h:mm'),
            icon: <PiCookingPotBold />
        },
        {
            name: 'rating',
            value: rating?.toString(),
            icon: <AiOutlineStar />
        }
    ];

    return (
        <li key={name} className={styles.listItem}>
            <div className={styles.image}>
                <img src={imageUrl} alt={`Image of ${name}`} />
            </div>
            <div className={styles.text}>
                <span className={styles.topLine}>
                    <h1 className={styles.title}>{name}</h1>
                    {bookmarked && <PiBookmarkSimpleFill />}
                </span>
                <Details details={details} />
                <div className={styles.tags}>
                    {orderedTags.map((tag) => (
                        <button key={`${name}${tag}`} data-selected={selectedTags.includes(tag)} onClick={() => handleTagClick(tag)}>
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
    details: IDetail[];
}

const Details: FC<IDetailsProps> = ({ details }) => {
    return (
        <ul className={styles.details}>
            {details.map(
                (detail, index) =>
                    isDefined(detail.value) && (
                        <>
                            <li className={formatClasses(styles, ['detail', detail.name])}>
                                {detail.icon}
                                <p>{detail.value}</p>
                            </li>
                            {index !== details.length - 1 && <div className={styles.divider} />}
                        </>
                    )
            )}
        </ul>
    );
};
