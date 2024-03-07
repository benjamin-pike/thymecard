import { FC } from 'react';
import { DateTime } from 'luxon';

import EventItem from './EventItem';
import Tooltip from '@/components/common/tooltip/Tooltip';
import EventIcon from '@/components/common/event-icon/EventIcon';

import { EEventType, IMealEventItem, isDefined } from '@thymecard/types';
import { formatDuration } from '@thymecard/utils';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';

import styles from './event.module.scss';

const BookmarkIcon = ICONS.recipes.bookmark;
const BookmarkFillIcon = ICONS.recipes.bookmarkFill;
const RemoveIcon = ICONS.common.XLarge;
const EditIcon = ICONS.recipes.create;
const DurationIcon = ICONS.common.duration;
const CaloriesIcon = ICONS.common.pieChart;

interface IEventProps {
    type: EEventType;
    time: number;
    duration: number;
    items: IMealEventItem[];
    bookmarkId?: string;
    isToday: boolean;
    gap?: number;
    handleSelectRecipe: (recipeId: string) => void;
    handleEditEventClick: () => void;
    handleBookmarkEventClick: () => void;
    handleDeleteEventClick: () => void;
    handleSelectEventItem: (itemId: string) => () => void;
}

const Event: FC<IEventProps> = ({
    type,
    time: timeM,
    duration,
    items,
    bookmarkId,
    isToday,
    gap,
    handleSelectRecipe,
    handleEditEventClick,
    handleBookmarkEventClick,
    handleDeleteEventClick,
    handleSelectEventItem
}) => {
    const time = DateTime.local().set({ hour: Math.floor(timeM / 60), minute: timeM % 60 });
    const isPastTime = time.plus({ minutes: duration }).diff(DateTime.now()).milliseconds < 0;
    const calories = items.reduce((acc, item) => acc + (item.calories || 0) * item.servings, 0);

    const isBookmarked = isDefined(bookmarkId);

    return (
        <>
            <li className={styles.event} data-event={type} data-past={isToday && isPastTime}>
                <h2 className={styles.time}>
                    <span className={styles.hours}>{time.toFormat('HH')}</span>
                    <span className={styles.minutes}>{time.toFormat('mm')}</span>
                </h2>
                <article className={styles.body}>
                    <header>
                        <div className={styles.type}>
                            <EventIcon className={styles.icon} type={type} background={false} radius={0.4} />
                            <div className={styles.separator} />
                            <h2>{capitalize(type)}</h2>
                        </div>
                        <div className={styles.metadata}>
                            <span className={styles.duration}>
                                <DurationIcon />
                                {formatDuration(duration, 'medium').replace(',', '')}
                            </span>
                            {!!calories && (
                                <>
                                    <div className={styles.separator} />
                                    <span className={styles.calories}>
                                        <CaloriesIcon />
                                        {calories} kcal
                                    </span>
                                </>
                            )}
                        </div>
                    </header>
                    <ul>
                        {items.map((item) => (
                            <EventItem
                                key={item.id}
                                {...item}
                                handleSelectRecipe={handleSelectRecipe}
                                handleSelectEventItem={handleSelectEventItem(item.id)}
                            />
                        ))}
                    </ul>
                </article>
                <div className={styles.buttons}>
                    <button
                        className={styles.editEvent}
                        data-tooltip-id="edit-event"
                        data-tooltip-content="Edit Event"
                        onClick={handleEditEventClick}
                    >
                        <EditIcon />
                    </button>
                    <button
                        className={styles.bookmark}
                        data-tooltip-id="bookmark-event"
                        data-tooltip-content={isBookmarked ? 'Event has already been bookmarked' : 'Bookmark Event'}
                        data-bookmarked={isBookmarked}
                        onClick={handleBookmarkEventClick}
                    >
                        {isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />}
                    </button>
                    <button
                        className={styles.remove}
                        onClick={handleDeleteEventClick}
                        data-tooltip-id="remove-event"
                        data-tooltip-content="Remove Event"
                    >
                        <RemoveIcon />
                    </button>
                </div>
                {isDefined(gap) && <p className={styles.timeGap}>+ {formatDuration(gap, 'long', true)}</p>}
                <Tooltip id="edit-event" size="small" place="left" offset={10} />
                <Tooltip id="bookmark-event" size="small" place="left" offset={10} />
                <Tooltip id="remove-event" size="small" place="left" offset={10} />
            </li>
            <div className={styles.divider} />
        </>
    );
};

export default Event;
