import { FC, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { usePlan } from '@/components/providers/PlanProvider';
import DayCell from './DayCell';
import LoadingDots from '@/components/common/loading-dots/LoadingDots';
import styles from './month.module.scss';

interface IMonthProps {
    currentDay: DateTime | null;
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    handleDayClick: (date: DateTime) => () => void;
    handleDayDoubleClick: (date: DateTime) => () => void;
    handleEventClick: (eventId: string) => () => void;
}

const Month: FC<IMonthProps> = ({
    currentDay,
    currentMonth,
    displayMeals,
    displayActivities,
    displayTime,
    handleDayClick,
    handleDayDoubleClick,
    handleEventClick
}) => {
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
                            isVisibleWhenTwoColumns,
                            isVisibleWhenThreeColumns,
                            handleDayClick,
                            handleDayDoubleClick,
                            handleEventClick
                        };

                        return <DayCell key={index} {...dayCellProps} />;
                    })}
                </div>
            </div>
        </section>
    );
};

export default Month;

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
