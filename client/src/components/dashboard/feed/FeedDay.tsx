import { FC, ReactElement, memo, useMemo } from 'react';
import { DateTime } from 'luxon';
import styles from './feed-day.module.scss';

interface IFeedDayProps {
    children: ReactElement;
    date: Date;
}

const FeedDay: FC<IFeedDayProps> = memo(({ children, date }) => {
    const isYesterday = useMemo(() => DateTime.fromJSDate(date).hasSame(DateTime.local(), 'day'), [date]);
    const formattedDate = useMemo(
        () => (isYesterday ? 'Yesterday' : DateTime.fromJSDate(date).toFormat('cccc dd LLLL')),
        [isYesterday, date]
    );
    return (
        <section className={styles.day}>
            <h1 className={styles.date}>{formattedDate}</h1>
            <section className={styles.events}>{children}</section>
        </section>
    );
});

export default FeedDay;
