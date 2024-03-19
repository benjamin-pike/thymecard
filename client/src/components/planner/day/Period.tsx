import { FC } from 'react';

import Event from './Event';

import { ICONS } from '@/assets/icons';
import { EEventType, IDayEvent } from '@thymecard/types';

import styles from './period.module.scss';

const AddIcon = ICONS.common.plus;

interface IPeriodProps {
    events: IDayEvent[];
    period: { start: number; end: number };
    gap: string | null;
    isFinalPeriod: boolean;
    addNamedEventButtons: {
        before: JSX.Element[];
        middle: JSX.Element[];
        after: JSX.Element[];
    };
    handleOpenAddEventModal: () => void;
    handleOpenEditEventModal: (id: string) => () => void;
    handleOpenBookmarkEventModal: (id: string) => () => void;
}

const Period: FC<IPeriodProps> = ({
    events,
    period,
    gap,
    isFinalPeriod,
    addNamedEventButtons,
    handleOpenAddEventModal,
    handleOpenEditEventModal,
    handleOpenBookmarkEventModal
}) => {
    const length = period.end - period.start;
    const hasMultipleMiddleButtons = addNamedEventButtons.middle.length !== 1;

    return (
        <>
            {...addNamedEventButtons.before}

            <div className={styles.period} style={{ height: `${length * 8}rem` }}>
                {Array.from({ length: length * 4 + 1 }).map((_, i) => (
                    <GridLine
                        key={i}
                        startHour={period.start}
                        i={i}
                        periodLength={length}
                        displayLine={calculateShouldDisplayGridLine(60 * (period.start + i / 4), events)}
                        coincidingEventType={getCoincidingEventType(60 * (period.start + i / 4), events)}
                    />
                ))}

                {events.map((event) => (
                    <Event
                        key={event._id}
                        event={event}
                        period={period}
                        handleOpenEditEventModal={handleOpenEditEventModal(event._id)}
                        handleOpenBookmarkEventModal={handleOpenBookmarkEventModal(event._id)}
                    />
                ))}
            </div>

            {!isFinalPeriod && (
                <div className={styles.gap}>
                    <p className={styles.pill}>{gap}</p>
                    {!hasMultipleMiddleButtons ? (
                        addNamedEventButtons.middle[0]
                    ) : (
                        <button className={styles.addButton} onClick={handleOpenAddEventModal}>
                            <AddIcon />
                        </button>
                    )}
                </div>
            )}

            {hasMultipleMiddleButtons && [...addNamedEventButtons.middle]}
            {[...addNamedEventButtons.after]}
        </>
    );
};

export default Period;

interface IGridLineProps {
    startHour: number;
    periodLength: number;
    i: number;
    displayLine: boolean;
    coincidingEventType: EEventType | undefined;
}

const GridLine: FC<IGridLineProps> = ({ i, startHour, periodLength, displayLine, coincidingEventType }) => {
    const decimalTime = startHour + i / 4;
    const quarterHourLabel = ((decimalTime % 1) * 60).toString().padStart(2, '0');

    return (
        <div className={styles.hour} style={{ top: `${(i / (periodLength * 4)) * 100}%` }}>
            <span className={styles.label}>{`${Math.floor(decimalTime)}:${quarterHourLabel}`}</span>
            {displayLine && <div className={styles.line} data-coinciding-event={coincidingEventType} />}
        </div>
    );
};

const calculateShouldDisplayGridLine = (timeM: number, events: IDayEvent[]): boolean => {
    for (const { time, duration } of events) {
        if (time === timeM || time + duration === timeM) {
            return false;
        }
    }

    return true;
};

const getCoincidingEventType = (timeM: number, events: IDayEvent[]): EEventType | undefined => {
    for (const event of events) {
        if (event.time <= timeM && event.time + event.duration > timeM) {
            return event.type;
        }
    }
};
