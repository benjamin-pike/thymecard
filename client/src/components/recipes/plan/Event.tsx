import { FC } from 'react';
import { DateTime } from 'luxon';
import EventItem from './EventItem';
import { EventType, IEventItem } from '@thymecard/types';
import { buildKey, formatDuration } from '@thymecard/utils';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import styles from './event.module.scss';

const BookmarkIcon = ICONS.recipes.bookmark;
const RemoveIcon = ICONS.common.XLarge;
const EditIcon = ICONS.recipes.create;

interface IEventProps {
    type: EventType;
    time: DateTime;
    duration: number;
    calories?: number;
    items: IEventItem[];
    isToday: boolean;
    handleSelectRecipe: (recipeId: string) => void;
}

const Event: FC<IEventProps> = ({ type, time, duration, calories, items, isToday, handleSelectRecipe }) => {
    const isPastTime = time.plus({ minutes: duration }).diff(DateTime.now()).milliseconds < 0;

    return (
        <div className={styles.event} data-event={type} data-past={isToday && isPastTime}>
            <header>
                <h2 className={styles.eventTime}>{time.toFormat('H:mm')}</h2>
                <h2 className={styles.eventType}>{capitalize(type)}</h2>
                <button className={styles.addItem}>
                    <EditIcon />
                    <p>Edit Event</p>
                </button>
                <button className={styles.bookmark}>
                    <BookmarkIcon />
                    <p>Bookmark Event</p>
                </button>
                <button className={styles.remove}>
                    <RemoveIcon />
                    <p>Remove Event</p>
                </button>
                <h2 className={styles.eventMetadata}>
                    <span>{formatDuration(duration, 'medium').replace(',', '')}</span>
                    {calories && (
                        <>
                            {'   |   '}
                            <span>{calories} kcal</span>
                        </>
                    )}
                </h2>
            </header>
            <ul>
                {items.map((item, i) => (
                    <EventItem key={buildKey(item.title, i)} {...item} handleSelectRecipe={handleSelectRecipe} />
                ))}
            </ul>
        </div>
    );
};

export default Event;
