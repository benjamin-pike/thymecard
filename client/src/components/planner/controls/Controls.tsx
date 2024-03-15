import { DateTime } from 'luxon';
import { EEventDisplayFormat } from '../planner.types';
import { formatClasses } from '@/lib/common.utils';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { MdOutlineFastfood, MdOutlineViewDay } from 'react-icons/md';
import { FiActivity, FiClock } from 'react-icons/fi';
import styles from './controls.module.scss';
import Tooltip from '@/components/common/tooltip/Tooltip';

interface IControlBarProps {
    currentMonth: DateTime;
    displayMeals: boolean;
    displayActivities: boolean;
    displayTime: boolean;
    eventDisplayFormat: EEventDisplayFormat;
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
                data-tooltip-id="tooltip-toggle-view"
                data-tooltip-content="Toggle View"
                onClick={toggleDisplayFormat}
            >
                <MdOutlineViewDay />
            </button>
            <button
                className={styles.button}
                data-active={displayTime}
                data-tooltip-id="tooltip-toggle-time"
                data-tooltip-content={`${displayTime ? 'Hide' : 'Show'} Event Times`}
                onClick={toggleTime}
            >
                <FiClock />
            </button>
            <div className={styles.divider} />
            <button
                className={styles.button}
                data-active={displayMeals}
                data-tooltip-id="tooltip-toggle-meals"
                data-tooltip-content={`${displayMeals ? 'Hide' : 'Show'} Meals`}
                onClick={toggleMeals}
            >
                <MdOutlineFastfood />
            </button>
            <button
                className={styles.button}
                data-active={displayActivities}
                data-tooltip-id="tooltip-toggle-activities"
                data-tooltip-content={`${displayActivities ? 'Hide' : 'Show'} Activities`}
                onClick={toggleActivities}
            >
                <FiActivity />
            </button>
            <div className={styles.divider} />
            <button className={formatClasses(styles, ['button', 'today'])} onClick={handleToday}>
                Today
            </button>
            <Tooltip id="tooltip-toggle-view" place="bottom" size="small" offset={17.5} />
            <Tooltip id="tooltip-toggle-time" place="bottom" size="small" offset={10} />
            <Tooltip id="tooltip-toggle-meals" place="bottom" size="small" offset={10} />
            <Tooltip id="tooltip-toggle-activities" place="bottom" size="small" offset={10} />
        </section>
    );
};

export default ControlBar;
