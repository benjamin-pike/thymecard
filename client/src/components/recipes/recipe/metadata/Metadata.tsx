import { FC } from 'react';
import { DateTime, Duration } from 'luxon';
import { IRecipeMetadata } from '@/types/recipe.types';
import { numberToStars } from '@/lib/elements.utils';
import styles from './metadata.module.scss';

interface IMetadataProps {
    data: IRecipeMetadata;
    scale: number;
}

const Metadata: FC<IMetadataProps> = ({ data, scale }) => {
    const urlRoot = data.url?.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];

    const prepTime = (() => {
        if (!data.prepTime) return null;
        if (data.prepTime < 60) return `${data.prepTime} minutes`;
        if (data.prepTime < 120) return Duration.fromObject({ minutes: data.prepTime }).toFormat("h 'hour,' m 'minutes'");

        const time = Duration.fromObject({ minutes: data.prepTime }).toFormat("h 'hours,' m 'minutes'");
        return time.endsWith(', 0 minutes') ? time.replace(', 0 minutes', '') : time;
    })();

    const cookTime = (() => {
        if (!data.cookTime) return null;
        if (data.cookTime < 60) return `${data.cookTime} minutes`;
        if (data.cookTime < 120) return Duration.fromObject({ minutes: data.cookTime }).toFormat("h 'hour,' m 'minutes'");

        const time = Duration.fromObject({ minutes: data.cookTime }).toFormat("h 'hours,' m 'minutes'");
        return time.endsWith(', 0 minutes') ? time.replace(', 0 minutes', '') : time;
    })();

    const totalTime = (() => {
        if (!data.totalTime) return null;
        if (data.totalTime < 60) return `${data.totalTime} minutes`;
        if (data.totalTime < 120) return Duration.fromObject({ minutes: data.totalTime }).toFormat("h 'hour,' m 'minutes'");

        const time = Duration.fromObject({ minutes: data.totalTime }).toFormat("h 'hours,' m 'minutes'");
        return time.endsWith(', 0 minutes') ? time.replace(', 0 minutes', '') : time;
    })();

    const dateAdded = (() => {
        return DateTime.fromJSDate(data.created).toFormat('MMMM d, yyyy');
    })();

    const dateLastCooked = (() => {
        if (!data.lastCooked) return null;

        return DateTime.fromJSDate(data.lastCooked).toFormat('MMMM d, yyyy');
    })();

    const stars = numberToStars(data.rating ?? 0);

    return (
        <div className={styles.details}>
            <div className={styles.origin}>
                <p className={styles.author}>
                    {data.author ? (
                        <>
                            <span className={styles.by}>By</span> <span className={styles.name}>{data.author}</span>
                        </>
                    ) : (
                        <p className={styles.add}>Add author</p>
                    )}
                </p>
                {data.url && (
                    <a className={styles.url} href={data.url} target="_blank">
                        {urlRoot}
                    </a>
                )}
            </div>
            <div className={styles.divider} />
            <ul className={styles.metrics}>
                <li>
                    <p className={styles.metric}>SERVES</p>{' '}
                    <p className={styles.value}>
                        {data.yield.quantity.map((q) => q * scale).join(' - ')} {data.yield.units}
                    </p>
                    {scale !== 1 && <p className={styles.scale}>{scale}x</p>}
                </li>
                <div className={styles.divider} />
                <li>
                    <p className={styles.metric}>PREP</p>{' '}
                    {prepTime ? <p className={styles.value}>{prepTime}</p> : <p className={styles.add}>Add prep time</p>}
                </li>
                <li>
                    <p className={styles.metric}>COOK</p>{' '}
                    {cookTime ? <p className={styles.value}>{cookTime}</p> : <p className={styles.add}>Add prep time</p>}
                </li>
                <li>
                    <p className={styles.metric}>TOTAL</p>{' '}
                    {totalTime ? <p className={styles.value}>{totalTime}</p> : <p className={styles.add}>Add prep time</p>}
                </li>
                <div className={styles.divider} />
                <li className={styles.rating}>
                    <p className={styles.metric}>RATING</p>{' '}
                    <span className={styles.value} data-defined={!!data.rating}>
                        {stars.map((star) => star)}
                    </span>
                </li>
                <div className={styles.divider} />
                <li>
                    <p className={styles.metric}>ADDED</p> <p className={styles.value}>{dateAdded}</p>
                </li>
                <li>
                    <p className={styles.metric}>COOKED</p>{' '}
                    {dateLastCooked ? <p className={styles.value}>{dateLastCooked}</p> : <p className={styles.add}>Log first cook</p>}
                </li>
            </ul>
            <div className={styles.divider} />
            <div className={styles.tags}>
                {data.tags.map((tag) => (
                    <p key={tag}>{tag}</p>
                ))}
            </div>
        </div>
    );
};

export default Metadata;
