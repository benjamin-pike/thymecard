import { FC, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Client, IMealEventBookmark } from '@thymecard/types';
import { formatDuration, minsToHoursAndMins } from '@thymecard/utils';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import styles from './meal-event-bookmark-search-result.module.scss';

const TimeIcon = ICONS.common.time;
const DurationIcon = ICONS.common.duration;
const CaloriesIcon = ICONS.common.pieChart;

interface IEventBookmarkSearchResultProps {
    result: Client<IMealEventBookmark>;
    handleSelectResult: (bookmark: Client<IMealEventBookmark>) => void;
    handleCloseSearch: () => void;
}

const EventBookmarkSearchResult: FC<IEventBookmarkSearchResultProps> = ({ result, handleSelectResult, handleCloseSearch }) => {
    const time = useMemo(() => {
        if (!result.time) {
            return;
        }

        const { hours, minutes } = minsToHoursAndMins(result.time);

        return DateTime.local().set({ hour: hours, minute: minutes });
    }, [result]);

    const calories = useMemo(() => result.items.reduce((acc, item) => acc + (item.calories || 0) * item.servings, 0), [result.items]);

    const handleClick = useCallback(() => {
        handleSelectResult(result);

        handleCloseSearch();
    }, [handleCloseSearch, handleSelectResult, result]);

    return (
        <li className={styles.result}>
            <button onClick={handleClick}>
                <div className={styles.row}>
                    <p className={styles.title}>{result.name}</p>
                    <ul className={styles.metadata}>
                        {result.type && (
                            <li className={styles.type} data-type={result.type}>
                                {capitalize(result.type)}
                            </li>
                        )}
                        {time && (
                            <>
                                <div className={styles.separator} />
                                <li className={styles.time}>
                                    <TimeIcon />
                                    {time.toLocaleString(DateTime.TIME_SIMPLE)}
                                </li>
                            </>
                        )}
                        {result.duration && (
                            <>
                                <div className={styles.separator} />
                                <li className={styles.duration}>
                                    <DurationIcon />
                                    {formatDuration(result.duration, 'medium')}
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <div className={styles.row}>
                    <span className={styles.calories}>
                        <CaloriesIcon />
                        {calories} kcal
                    </span>
                    <span className={styles.bullet}>•</span>
                    <p className={styles.items}>
                        {result.items.map((item, index, arr) => (
                            <>
                                <span key={index} className={styles.item}>
                                    {item.servings > 1 ? `${item.servings} x ` : ''}
                                    {item.name}
                                </span>
                                {index < arr.length - 1 && <span className={styles.split}>|</span>}
                            </>
                        ))}
                    </p>
                </div>
            </button>
        </li>
    );
};

export default EventBookmarkSearchResult;
