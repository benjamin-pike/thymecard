import { FC } from 'react';
import { DateTime } from 'luxon';
import Popover from '@/components/wrappers/popover/Popover';
import EventPopover from '../popovers/EventPopover';
import { Client, EEventType, IDay } from '@thymecard/types';
import { formatTimeM } from '@thymecard/utils';
import styles from './day-cell.module.scss';

interface IDayCellProps {
    day: Client<IDay> | null;
    date: DateTime;
    index: number;
    cellCount: number;
    currentDay: DateTime | null;
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    isVisibleWhenTwoColumns: boolean;
    isVisibleWhenThreeColumns: boolean;
    handleDayClick: (date: DateTime) => () => void;
    handleDayDoubleClick: (date: DateTime) => () => void;
    handleOpenEditEventModal: (eventId: string) => () => void;
    handleOpenBookmarkEventModal: (eventId: string) => () => void;
}

const DayCell: FC<IDayCellProps> = ({
    day,
    date,
    currentDay,
    currentMonth,
    displayMeals,
    displayActivities,
    displayTime,
    isVisibleWhenTwoColumns,
    isVisibleWhenThreeColumns,
    handleDayClick,
    handleDayDoubleClick,
    handleOpenEditEventModal,
    handleOpenBookmarkEventModal
}) => {
    const isCurrentDay = currentDay && date.hasSame(currentDay, 'day');
    const isCurrentMonth = date.month === currentMonth.month;
    const isToday = date.hasSame(DateTime.local(), 'day');
    const isFirstDayOfCurrentMonth = isCurrentMonth && date.day === 1;
    const isLastDayOfCurrentMonth = isCurrentMonth && date.day === date.daysInMonth;
    const displayMonth = date.day === 1;

    return (
        <div
            key={date.toFormat('yyyy-MM-dd')}
            className={styles.cell}
            data-today={isToday}
            data-current-day={isCurrentDay}
            data-current-month={isCurrentMonth}
            data-weekend={date.weekday > 5}
            data-populated={!!day?.events.length}
            data-hidden-two-columns={!isVisibleWhenTwoColumns}
            data-hidden-three-columns={!isVisibleWhenThreeColumns}
            data-first={isFirstDayOfCurrentMonth}
            data-last={isLastDayOfCurrentMonth}
            onClick={handleDayClick(date)}
            onDoubleClick={handleDayDoubleClick(date)}
        >
            <p className={styles.date}>
                {displayMonth ? `${date.monthShort} ${date.day}` : date.day} <span className={styles.day}> • {date.weekdayShort}</span>
            </p>
            {day?.events.length ? (
                <ul className={styles.events}>
                    {day.events.map((event, k) => {
                        if (event.type !== EEventType.ACTIVITY && !displayMeals) {
                            return null;
                        }

                        if (event.type === EEventType.ACTIVITY && !displayActivities) {
                            return null;
                        }

                        return (
                            <Popover
                                key={k}
                                content={
                                    <EventPopover
                                        event={event}
                                        handleOpenEditEventModal={handleOpenEditEventModal(event._id)}
                                        handleOpenBookmarkEventModal={handleOpenBookmarkEventModal(event._id)}
                                    />
                                }
                                placement="bottom"
                                strategy="fixed"
                            >
                                <li key={k} className={styles.event} data-event={event.type}>
                                    <p className={styles.name}>{event.items.map((item) => item.name).join(', ')}</p>
                                    {displayTime && <p className={styles.time}>{formatTimeM(event.time)}</p>}
                                </li>
                            </Popover>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.noEvents}>
                    No <strong>Planned</strong> Events
                </p>
            )}
        </div>
    );
};

export default DayCell;
