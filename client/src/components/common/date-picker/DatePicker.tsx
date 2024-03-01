import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';

import { useToggle } from '@mantine/hooks';

import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { ICONS } from '@/assets/icons';

import styles from './date-picker.module.scss';

const LeftIcon = ICONS.common.chevronLeft;
const RightIcon = ICONS.common.chevronRight;

interface IDatePickerProps {
    selectedDay?: DateTime;
    blockPast?: boolean;
    blockFuture?: boolean;
    blockToday?: boolean;
    handleSelectDay: (day: DateTime) => void;
}

const DatePicker: FC<IDatePickerProps> = ({ selectedDay: initialSelectedDay, blockPast, blockFuture, blockToday, handleSelectDay }) => {
    const [selectedMonth, setSelectedMonth] = useState(initialSelectedDay || DateTime.local());
    const [selectedDay, setSelectedDay] = useState(initialSelectedDay);

    const [mode, toggleMode] = useToggle(['day', 'month']);

    const today = useMemo(() => DateTime.now().startOf('day'), []);
    const isPast = useCallback((date: DateTime) => date < today, [today]);
    const isFuture = useCallback((date: DateTime) => date > today, [today]);
    const isToday = useCallback((date: DateTime) => date.toISODate() === today.toISODate(), [today]);

    const startDayOfMonth = selectedMonth.startOf('month');
    const endDayOfMonth = selectedMonth.endOf('month');
    const startDayOfGrid = startDayOfMonth.startOf('week');
    const endDayOfGrid = endDayOfMonth.endOf('week');

    let currentDate = startDayOfGrid;
    const days = [];

    while (currentDate <= endDayOfGrid) {
        days.push(currentDate);
        currentDate = currentDate.plus({ days: 1 });
    }

    const handleDayClick = useCallback(
        (day: DateTime) => {
            if ((blockPast && isPast(day)) || (blockFuture && isFuture(day)) || (blockToday && isToday(day))) {
                return;
            }

            setSelectedMonth(day);
            setSelectedDay(day);
            handleSelectDay(day);
        },
        [blockFuture, blockPast, blockToday, handleSelectDay, isFuture, isPast, isToday]
    );

    const handleDecrementShift = useCallback(() => {
        if (mode === 'day') {
            setSelectedMonth(selectedMonth.minus({ months: 1 }));
        } else if (mode === 'month') {
            setSelectedMonth(selectedMonth.minus({ years: 1 }));
        }
    }, [mode, selectedMonth]);

    const handleIncrementShift = useCallback(() => {
        if (mode === 'day') {
            setSelectedMonth(selectedMonth.plus({ months: 1 }));
        } else if (mode === 'month') {
            setSelectedMonth(selectedMonth.plus({ years: 1 }));
        }
    }, [mode, selectedMonth]);

    const handleToggleMode = useCallback(() => {
        toggleMode();
    }, [toggleMode]);

    const handleMonthClick = useCallback(
        (month: string) => () => {
            setSelectedMonth(selectedMonth.set({ month: DateTime.fromFormat(month, 'LLL').month }));
            toggleMode();
        },
        [selectedMonth, toggleMode]
    );

    useWindowKeyDown('ArrowLeft', handleDecrementShift);
    useWindowKeyDown('ArrowRight', handleIncrementShift);

    useEffect(() => {
        if (initialSelectedDay && initialSelectedDay.toISO() !== selectedDay?.toISO()) {
            setSelectedDay(initialSelectedDay);
            setSelectedMonth(initialSelectedDay);
        }
    }, [initialSelectedDay, selectedDay]);

    return (
        <div className={styles.picker} data-mode={mode}>
            <div className={styles.monthYear}>
                <button className={styles.shift} onClick={handleDecrementShift}>
                    {<LeftIcon />}
                </button>
                <button className={styles.current} onClick={handleToggleMode}>
                    {mode === 'day' && <p className={styles.month}>{selectedMonth.toFormat('MMM')}</p>}
                    <p className={styles.year}>{selectedMonth.toFormat('yyyy')}</p>
                </button>
                <button className={styles.shift} onClick={handleIncrementShift}>
                    {<RightIcon />}
                </button>
            </div>

            {mode === 'day' && (
                <>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                        <h3 key={day} className={styles.day}>
                            {day}
                        </h3>
                    ))}

                    {days.map((day) => (
                        <button
                            key={day.toISODate()}
                            className={styles.option}
                            data-selected={day.toISODate() === selectedDay?.toISODate()}
                            data-current-month={day.month === selectedMonth.month}
                            onClick={() => handleDayClick(day)}
                            disabled={(blockPast && isPast(day)) || (blockFuture && isFuture(day)) || (blockToday && isToday(day))}
                        >
                            {day.day}
                        </button>
                    ))}
                </>
            )}

            {mode === 'month' && (
                <>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                        <button
                            key={month}
                            className={styles.option}
                            data-selected={month === selectedMonth.toFormat('MMM')}
                            data-left={i % 3 === 0}
                            data-right={i % 3 === 2}
                            data-top={i < 3}
                            data-bottom={i > 8}
                            onClick={handleMonthClick(month)}
                        >
                            {month}
                        </button>
                    ))}
                </>
            )}
        </div>
    );
};

export default DatePicker;
