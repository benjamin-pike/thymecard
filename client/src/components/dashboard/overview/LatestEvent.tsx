import { FC } from 'react';
import { DateTime } from 'luxon';
import styles from './latest-event.module.css';

type Category = 'Meal' | 'Activity';

interface ILatestEventProps {
    category: Category;
    name: string;
    calories: number;
    lastDate: Date;
}

const LatestEvent: FC<ILatestEventProps> = ({ category, name, calories, lastDate }) => {
    const dateLuxon = DateTime.fromJSDate(lastDate);
    const includeYear = dateLuxon.year !== DateTime.now().year;
    return (
        <a className={styles.event}>
            <h2 className={styles.category}>Latest <strong>{category}</strong></h2>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.calories}>
                <strong>
                    {calories < 0 ? '−' : '+'}
                    {Math.abs(calories)}
                </strong>{' '}
                calories
            </p>
            <p className={styles.lastDate}>
                <span className={styles.time}>
                    {dateLuxon.toFormat('HH:mm')}
                </span>
                {'  •  '}
                <span className={styles.date}>
                    {dateLuxon.toFormat('d MMMM') + (includeYear ? dateLuxon.toFormat(' yyyy') : '')}
                </span>
            </p>
        </a>
    );
};

export default LatestEvent;