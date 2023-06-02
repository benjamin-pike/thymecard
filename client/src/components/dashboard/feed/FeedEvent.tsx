import { FC } from 'react';
import { DateTime } from 'luxon';
import Card from '@/components/common/Card';
import ImageGrid from '@/components/common/ImageGrid';
import { formatClasses } from '@/lib/common.utils';
import { MdLocationOn } from 'react-icons/md';
import { IFeedEventProps } from './feed.types';
import styles from './feed-event.module.css';

const UNITS: Record<string, string> = {
    carbs: 'g',
    fat: 'g',
    protein: 'g'
};

const FeedEvent: FC<IFeedEventProps> = ({ type, time, location, rating, name, metrics, journal, visuals }) => {
    const formattedTime = DateTime.fromJSDate(time).toFormat('hh:mm');
    return (
        <Card>
            <header className={styles.header}>
                <div className={styles.metadata}>
                    <div className={styles.leftContent}>
                        <div className={formatClasses(styles, ['typeIndicator', type.toLowerCase()])}/>
                        <p className={styles.type}>{type}</p>
                        <p>•</p>
                        <p className={styles.time}>{formattedTime}</p>
                        {location && (
                            <>
                                <p>•</p>
                                <div className={styles.location}>
                                    <MdLocationOn />
                                    <p>{location}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles.rightContent}>{rating && <Rating value={rating} />}</div>
                </div>
                <h1 className={styles.name}><a>{name}</a></h1>
            </header>
            <div className={styles.body}>
                <section className={styles.metrics}>
                    <div className={formatClasses(styles, ['primary', 'metric'])}>
                        <p className={styles.value}>
                            {metrics.primary.value}
                            <span className={styles.unit}>{UNITS[metrics.primary.measurement] ?? ''}</span>
                        </p>
                        <p className={styles.measurement}>{metrics.primary.measurement}</p>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.secondaryMetrics}>
                        {metrics.secondary.map(({ measurement, value }) => (
                            <div className={formatClasses(styles, ['secondary', 'metric'])} data-metric={measurement}>
                                <p className={styles.value}>
                                    {value.toFixed(1)}
                                    <span className={styles.unit}>{UNITS[measurement] ?? ''}</span>
                                </p>
                                <p className={styles.measurement}>{measurement}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {journal && <article className={styles.journal}>{journal}</article>}
                {visuals && (
                    <section className={styles.visuals}>
                        <ImageGrid urls = {visuals} height = {15}/>
                    </section>
                )}
            </div>
        </Card>
    );
};

export default FeedEvent;

const Rating = ({ value }: { value: number }) => {
    return (
        <div className={styles.rating}>
            {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.circle} data-fill={(i + 1) * 2 < value ? 'full' : i * 2 - 1 < value ? 'half' : 'empty'} />
            ))}
        </div>
    );
};