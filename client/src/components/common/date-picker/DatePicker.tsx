import { FC, useState } from 'react';
import { DateTime } from 'luxon';
import styles from './date-picker.module.scss';
import { ICONS } from '@/assets/icons';

const LeftIcon = ICONS.common.chevronLeft;
const RightIcon = ICONS.common.chevronRight;

interface IDatePickerProps {
    selectedDay?: DateTime;
    blockPast?: boolean;
    blockFuture?: boolean;
    handleSelectDay: (day: DateTime) => void;
}

const DatePicker: FC<IDatePickerProps> = ({ selectedDay: initialSelectedDay, blockPast, blockFuture, handleSelectDay }) => {
    const [selectedMonth, setSelectedMonth] = useState(initialSelectedDay || DateTime.local());
    const [selectedDay, setSelectedDay] = useState(initialSelectedDay || DateTime.local());

    const today = DateTime.local();
    const isPast = (date: DateTime) => date < today;
    const isFuture = (date: DateTime) => date > today;

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

    const handleDayClick = (day: DateTime) => {
        if ((blockPast && isPast(day)) || (blockFuture && isFuture(day))) {
            return;
        }
        setSelectedMonth(day);
        setSelectedDay(day);
        handleSelectDay(day);
    };

    return (
        <div className={styles.picker}>
            <div className={styles.monthYear}>
                <button onClick={() => setSelectedMonth(selectedMonth.minus({ months: 1 }))}>{<LeftIcon />}</button>
                <p>
                    <span className={styles.month}>{selectedMonth.toFormat('MMM')}</span>{' '}
                    <span className={styles.year}>{selectedMonth.toFormat('yyyy')}</span>
                </p>
                <button onClick={() => setSelectedMonth(selectedMonth.plus({ months: 1 }))}>{<RightIcon />}</button>
            </div>

            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                <h3 key={day} className={styles.day}>
                    {day}
                </h3>
            ))}

            {days.map((day) => (
                <button
                    key={day.toISODate()}
                    className={styles.date}
                    data-selected={day.toISODate() === selectedDay.toISODate()}
                    data-current-month={day.month === selectedMonth.month}
                    onClick={() => handleDayClick(day)}
                    disabled={(blockPast && isPast(day)) || (blockFuture && isFuture(day))}
                >
                    {day.day}
                </button>
            ))}
        </div>
    );
};

export default DatePicker;
