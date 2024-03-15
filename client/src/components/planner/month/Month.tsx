import { FC, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { EEventDisplayFormat } from '../planner.types';
import styles from './month.module.scss';
import { Client, EEventType, IDay } from '@thymecard/types';
import { usePlan } from '@/components/providers/PlanProvider';
import { formatTimeM } from '@thymecard/utils';
import LoadingDots from '@/components/common/loading-dots/LoadingDots';

interface IMonthProps {
    currentDay: DateTime | null;
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    eventDisplayFormat: EEventDisplayFormat;
    handleDayClick: (date: DateTime) => void;
}

const Month = ({
    currentDay,
    currentMonth,
    displayMeals,
    displayActivities,
    eventDisplayFormat,
    displayTime,
    handleDayClick
}: IMonthProps) => {
    const { plan, startDate, endDate, isLoading, handleFetchDays } = usePlan();

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dates = useMemo(() => generateMonth(currentMonth), [currentMonth]);
    const cellCount = dates.flat().length;

    const indexOffset = dates[0].diff(startDate, 'days').days;

    useEffect(() => {
        const periodStartDate = dates[0];
        const periodEndDate = dates[dates.length - 1];

        if (
            startDate < periodStartDate ||
            (startDate.toISODate() === periodStartDate.toISODate() &&
                (endDate >= periodEndDate || (endDate.toISODate() === periodEndDate.toISODate() && !isLoading)))
        ) {
            return;
        }

        handleFetchDays(dates[0], dates.length);
    }, [dates, endDate, handleFetchDays, isLoading, plan, startDate]);

    return (
        <section className={styles.month} data-loading={isLoading}>
            {isLoading && (
                <div className={styles.loading}>
                    <LoadingDots />
                </div>
            )}
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
                        const day = plan[index + indexOffset];

                        const isVisibleWhenTwoColumns = isInDivisibleSubArray(dates.flat(), index, 2);
                        const isVisibleWhenThreeColumns = isInDivisibleSubArray(dates.flat(), index, 3);
                        const dayCellProps = {
                            day,
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
    day: Client<IDay> | null;
    date: DateTime;
    index: number;
    cellCount: number;
    currentDay: DateTime | null;
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    eventDisplayFormat: EEventDisplayFormat;
    isVisibleWhenTwoColumns: boolean;
    isVisibleWhenThreeColumns: boolean;
    handleDayClick: (date: DateTime) => void;
}

const DayCell: FC<IDayCellProps> = ({
    day,
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
            data-populated={!!day?.events.length}
            data-hidden-two-columns={!isVisibleWhenTwoColumns}
            data-hidden-three-columns={!isVisibleWhenThreeColumns}
            data-first={isFirstDayOfCurrentMonth}
            data-last={isLastDayOfCurrentMonth}
            data-format={eventDisplayFormat}
            onClick={() => handleDayClick(date)}
        >
            <p className={styles.date}>
                {displayMonth ? `${date.monthShort} ${date.day}` : date.day} <span className={styles.dayName}> • {date.weekdayShort}</span>
            </p>
            {day?.events.length ? (
                day.events.map((event, k) => {
                    if (event.type !== EEventType.ACTIVITY && !displayMeals) {
                        return null;
                    }

                    if (event.type === EEventType.ACTIVITY && !displayActivities) {
                        return null;
                    }

                    return (
                        <div key={k} className={styles.event} data-event={event.type} data-format={eventDisplayFormat}>
                            <p className={styles.eventName}>{event.items.map((item) => item.name).join(', ')}</p>
                            {displayTime && <p className={styles.eventTime}>{formatTimeM(event.time)}</p>}
                        </div>
                    );
                })
            ) : (
                <p className={styles.noEvents}>
                    No <strong>Planned</strong> Events
                </p>
            )}
        </div>
    );
};

const generateMonth = (month: DateTime): DateTime[] => {
    const firstDayOfCurrentMonth = month.startOf('month');
    const lastDayOfPrevMonth = firstDayOfCurrentMonth.minus({ day: 1 });
    const firstDayOfNextMonth = firstDayOfCurrentMonth.plus({ month: 1 });
    const days: DateTime[] = [];

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
