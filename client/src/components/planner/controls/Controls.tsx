import { DateTime } from 'luxon';
import { formatClasses } from '@/lib/common.utils';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { MdOutlineFastfood, MdOutlineViewDay } from 'react-icons/md';
import { FiActivity, FiClock } from 'react-icons/fi';
import styles from './controls.module.scss';

interface IControlBarProps {
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    eventDisplayFormat: 'compact' | 'detailed' | 'expanded';
    handleMonthBackward: () => void;
    handleMonthForward: () => void;
    toggleMeals: () => void;
    toggleActivities: () => void;
    toggleTime: () => void;
    toggleDisplayFormat: () => void;
    handleToday: () => void;
}

const ControlBar = ({
    currentMonth,
    displayMeals,
    displayActivities,
    displayTime,
    eventDisplayFormat,
    handleMonthBackward,
    handleMonthForward,
    toggleMeals,
    toggleActivities,
    toggleTime,
    toggleDisplayFormat,
    handleToday
}: IControlBarProps) => {
    return (
        <section className={styles.controls}>
            <div className={styles.month}>
                <button className={formatClasses(styles, ['button', 'backward'])} onClick={handleMonthBackward}>
                    <BsChevronLeft />
                </button>
                <p>
                    {currentMonth.toFormat('MMM')} <span>{currentMonth.toFormat('yyyy')}</span>
                </p>
                <button className={formatClasses(styles, ['button', 'forward'])} onClick={handleMonthForward}>
                    <BsChevronRight />
                </button>
            </div>
            <button
                className={formatClasses(styles, ['button', 'toggleEventDisplayFormat', eventDisplayFormat])}
                onClick={toggleDisplayFormat}
            >
                <MdOutlineViewDay />
            </button>
            <button className={styles.button} data-active={displayTime} onClick={toggleTime}>
                <FiClock />
            </button>
            <div className={styles.divider} />
            <button className={styles.button} data-active={displayMeals} onClick={toggleMeals}>
                <MdOutlineFastfood />
            </button>
            <button className={styles.button} data-active={displayActivities} onClick={toggleActivities}>
                <FiActivity />
            </button>
            <div className={styles.divider} />
            <button className={formatClasses(styles, ['button', 'today'])} onClick={handleToday}>
                Today
            </button>
        </section>
    );
};

export default ControlBar;
