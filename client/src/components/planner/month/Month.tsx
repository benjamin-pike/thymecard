import { FC } from 'react';
import { DateTime } from 'luxon';
import { formatClasses } from '@/lib/common.utils';
import { PlannerData } from '../planner.types';
import { IEvent } from '@/lib/global.types';
import styles from './month.module.scss';

interface IMonthProps {
    data: PlannerData;
    currentDay: DateTime | null;
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    eventDisplayFormat: 'compact' | 'detailed' | 'expanded';
    handleDayClick: (date: DateTime) => void;
}

const Month = ({
    data,
    currentDay,
    currentMonth,
    displayMeals,
    displayActivities,
    eventDisplayFormat,
    displayTime,
    handleDayClick
}: IMonthProps) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dates = generateMonth(currentMonth);
    const cellCount = dates.flat().length;

    return (
        <section className={styles.month}>
            <div className={styles.calendar}>
                <div className={styles.days}>
                    {dayNames.map((day, i) => (
                        <div key={i} className={styles.day}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className={styles.body}>
                    {dates.flat().map((date, index) => {
                        const events = data[date.toFormat('yyyy-MM-dd')] ?? [];
                        const isVisibleWhenTwoColumns = isInDivisibleSubArray(dates.flat(), index, 2);
                        const isVisibleWhenThreeColumns = isInDivisibleSubArray(dates.flat(), index, 3);
                        const dayCellProps = {
                            events,
                            date,
                            index,
                            cellCount,
                            currentDay,
                            currentMonth,
                            displayMeals,
                            displayActivities,
                            displayTime,
                            eventDisplayFormat,
                            isVisibleWhenTwoColumns,
                            isVisibleWhenThreeColumns,
                            handleDayClick
                        };

                        return <DayCell key={index} {...dayCellProps} />;
                    })}
                </div>
            </div>
        </section>
    );
};

export default Month;

interface IDayCellProps {
    events: IEvent[];
    date: DateTime;
    index: number;
    cellCount: number;
    currentDay: DateTime | null;
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    eventDisplayFormat: 'compact' | 'detailed' | 'expanded';
    isVisibleWhenTwoColumns: boolean;
    isVisibleWhenThreeColumns: boolean;
    handleDayClick: (date: DateTime) => void;
}

const DayCell: FC<IDayCellProps> = ({
    events,
    date,
    currentDay,
    currentMonth,
    displayMeals,
    displayActivities,
    displayTime,
    eventDisplayFormat,
    isVisibleWhenTwoColumns,
    isVisibleWhenThreeColumns,
    handleDayClick
}) => {
    const isCurrentDay = currentDay && date.hasSame(currentDay, 'day');
    const isCurrentMonth = date.month === currentMonth.month;
    const isToday = date.hasSame(DateTime.local(), 'day');
    const displayMonth = date.day === 1;

    return (
        <div
            key={date.toFormat('yyyy-MM-dd')}
            className={formatClasses(styles, [
                'cell',
                isToday ? 'today' : '',
                isCurrentMonth ? '' : 'outsideCurrentMonth',
                isCurrentDay ? 'selected' : '',
                isVisibleWhenTwoColumns ? '' : 'hiddenWhenTwoColumns',
                isVisibleWhenThreeColumns ? '' : 'hiddenWhenThreeColumns'
            ])}
            onClick={() => handleDayClick(date)}
        >
            <p className={styles.date}>
                {displayMonth ? `${date.monthShort} ${date.day}` : date.day} <span className={styles.dayName}> • {date.weekdayShort}</span>
            </p>
            {events.map((event, k) => {
                if (event.type !== 'activity' && !displayMeals) {
                    return null;
                }

                if (event.type === 'activity' && !displayActivities) {
                    return null;
                }

                return (
                    <div key={k} className={formatClasses(styles, ['event', eventDisplayFormat])} data-event={event.type}>
                        <p className={styles.eventName}>{event.name}</p>
                        {displayTime && <p className={styles.eventTime}>{event.time}</p>}
                    </div>
                );
            })}
        </div>
    );
};

const generateMonth = (month: DateTime): DateTime[] => {
    const firstDayOfCurrentMonth = month.startOf('month');
    const lastDayOfPrevMonth = firstDayOfCurrentMonth.minus({ day: 1 });
    const firstDayOfNextMonth = firstDayOfCurrentMonth.plus({ month: 1 });
    let days: DateTime[] = [];

    for (let i = firstDayOfCurrentMonth.weekday; i > 1; i--) {
        days.push(lastDayOfPrevMonth.minus({ days: i - 2 }));
    }

    let day = firstDayOfCurrentMonth;
    while (day < firstDayOfNextMonth) {
        days.push(day);
        day = day.plus({ day: 1 });
    }

    while (days.length % 7 !== 0) {
        days.push(day);
        day = day.plus({ day: 1 });
    }

    return days;
};

function isInDivisibleSubArray(dates: DateTime[], index: number, divisor: number): boolean {
    const firstOfMonth = dates.find((date) => date.day === 1);
    const lastOfMonth = dates.find((date) => date.month === firstOfMonth?.month && date.day === firstOfMonth?.daysInMonth);

    if (!firstOfMonth || !lastOfMonth) {
        throw new Error('Invalid array of dates provided');
    }

    let firstIndex = dates.indexOf(firstOfMonth);
    let lastIndex = dates.indexOf(lastOfMonth);
    let arrayLength = lastIndex - firstIndex + 1;

    let remainder = arrayLength % divisor;

    if (remainder !== 0) {
        const daysToAdd = divisor - remainder;

        if (lastIndex + daysToAdd < dates.length) {
            lastIndex += daysToAdd;
        }

        remainder = (lastIndex - firstIndex + 1) % divisor;
        if (remainder !== 0) {
            firstIndex -= divisor - remainder;
        }

        arrayLength = lastIndex - firstIndex + 1;
    }

    return index >= firstIndex && index <= lastIndex;
}
