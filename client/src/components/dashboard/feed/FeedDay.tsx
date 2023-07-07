import { FC, ReactElement } from 'react';
import { DateTime } from 'luxon';
import styles from './feed-day.module.scss';

interface IFeedDayProps {
    children: ReactElement;
    date: Date;
}

const FeedDay: FC<IFeedDayProps> = ({ children, date }) => {
    const isYesterday = DateTime.fromJSDate(date).hasSame(DateTime.local(), 'day');
    const formattedDate = isYesterday ? 'Yesterday' : DateTime.fromJSDate(date).toFormat('cccc dd LLLL');
    return (
        <section className={styles.day}>
            <h1 className={styles.date}>{formattedDate}</h1>
            <section className={styles.events}>
                {children}
            </section>
        </section>
    );
};

export default FeedDay;