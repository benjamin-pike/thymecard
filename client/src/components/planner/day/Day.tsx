import { FC, useMemo } from 'react';
import { DateTime } from 'luxon';
import Header from './Header';
import Period from './Period';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { EEventType, IDayEvent } from '@thymecard/types';
import { minsToHoursAndMins } from '@thymecard/utils';
import styles from './day.module.scss';

const DEFAULT_EVENT_TIMES = {
    [EEventType.BREAKFAST]: 8,
    [EEventType.LUNCH]: 13,
    [EEventType.DINNER]: 19
};

interface IDayProps {
    data: IDayEvent[];
    date: DateTime | null;
    handleOpenAddEventModal: (type: EEventType | null, time: number | null) => () => void;
    handleOpenCopyEventsModal: () => void;
    handleOpenClearEventsModal: () => void;
    handleOpenEditEventModal: (id: string) => () => void;
    handleOpenBookmarkEventModal: (id: string) => () => void;
}

const Day: FC<IDayProps> = ({
    data,
    date,
    handleOpenAddEventModal,
    handleOpenCopyEventsModal,
    handleOpenClearEventsModal,
    handleOpenEditEventModal,
    handleOpenBookmarkEventModal
}) => {
    const isEmptyDay = data.length === 0;
    const periods = splitEvents(data, 15, 30);

    const hasBreakfast = data.some((event) => event.type === EEventType.BREAKFAST);
    const hasLunch = data.some((event) => event.type === EEventType.LUNCH);
    const hasDinner = data.some((event) => event.type === EEventType.DINNER);

    const namedEventButtons = useMemo(
        () => ({
            [EEventType.BREAKFAST]: (
                <button
                    key="addBreakfastButton"
                    className={styles.addButton}
                    onClick={handleOpenAddEventModal(EEventType.BREAKFAST, DEFAULT_EVENT_TIMES.BREAKFAST * 60)}
                >
                    Add Breakfast
                </button>
            ),
            [EEventType.LUNCH]: (
                <button
                    key="addLunchButton"
                    className={styles.addButton}
                    onClick={handleOpenAddEventModal(EEventType.LUNCH, DEFAULT_EVENT_TIMES.LUNCH * 60)}
                >
                    Add Lunch
                </button>
            ),
            [EEventType.DINNER]: (
                <button
                    key="addDinnerButton"
                    className={styles.addButton}
                    onClick={handleOpenAddEventModal(EEventType.DINNER, DEFAULT_EVENT_TIMES.DINNER * 60)}
                >
                    Add Dinner
                </button>
            )
        }),
        [handleOpenAddEventModal]
    );

    const namedEventRows = useMemo(
        () => ({
            [EEventType.BREAKFAST]: (
                <div key="addBreakfastRow" className={styles.gap}>
                    {namedEventButtons.BREAKFAST}
                </div>
            ),
            [EEventType.LUNCH]: (
                <div key="addLunchRow" className={styles.gap}>
                    {namedEventButtons.LUNCH}
                </div>
            ),
            [EEventType.DINNER]: (
                <div key="addDinnerRow" className={styles.gap}>
                    {namedEventButtons.DINNER}
                </div>
            )
        }),
        [namedEventButtons]
    );

    const getNamedEventButtons = (
        periods: IPeriodEvents[],
        index: number,
        required: { [EEventType.BREAKFAST]: boolean; [EEventType.LUNCH]: boolean; [EEventType.DINNER]: boolean }
    ) => {
        const events = [EEventType.BREAKFAST, EEventType.LUNCH, EEventType.DINNER] as const;

        const periodEndsAfter = (hour: number) => periods.findIndex((p) => p.period.end > hour);
        const periodStartsAfter = (hour: number) => periods.findIndex((p) => p.period.start > hour);

        const requiredEvents = events.filter((event) => required[event]);

        const before = requiredEvents.filter((event) => periodEndsAfter(DEFAULT_EVENT_TIMES[event]) === 0 && index === 0);
        const middle = requiredEvents.filter(
            (event) => periodStartsAfter(DEFAULT_EVENT_TIMES[event]) === index + 1 && !before.includes(event)
        );
        const after = requiredEvents.filter(
            (event) =>
                (periodEndsAfter(DEFAULT_EVENT_TIMES[event]) === -1 || periodEndsAfter(DEFAULT_EVENT_TIMES[event]) === index) &&
                periodStartsAfter(DEFAULT_EVENT_TIMES[event]) !== index &&
                index === periods.length - 1
        );

        return {
            before: before.map((event) => namedEventRows[event]),
            middle: middle.map((event) => (middle.length > 1 ? namedEventRows[event] : namedEventButtons[event])),
            after: after.map((event) => namedEventRows[event])
        };
    };

    return (
        date && (
            <>
                <div className={styles.wrapper}>
                    <ScrollWrapper height={'100%'} padding={1} buttonMargin={{ up: '1px' }}>
                        <section className={styles.day}>
                            <Header
                                date={date}
                                displayButtons={data.length > 0}
                                handleOpenAddEventModal={handleOpenAddEventModal(null, null)}
                                handleOpenCopyEventsModal={handleOpenCopyEventsModal}
                                handleOpenClearEventsModal={handleOpenClearEventsModal}
                            />
                            {periods.map(({ period, events }, index) => {
                                const gap = formatGapDuration(period.end, periods[index + 1]?.period.start);

                                const addNamedEventButtons = getNamedEventButtons(periods, index, {
                                    [EEventType.BREAKFAST]: !hasBreakfast,
                                    [EEventType.LUNCH]: !hasLunch,
                                    [EEventType.DINNER]: !hasDinner
                                });

                                const isFinalPeriod = index === periods.length - 1;

                                return (
                                    <Period
                                        key={JSON.stringify(period)}
                                        events={events}
                                        period={period}
                                        gap={gap}
                                        isFinalPeriod={isFinalPeriod}
                                        addNamedEventButtons={addNamedEventButtons}
                                        handleOpenAddEventModal={handleOpenAddEventModal(null, period.end * 60)}
                                        handleOpenEditEventModal={handleOpenEditEventModal}
                                        handleOpenBookmarkEventModal={handleOpenBookmarkEventModal}
                                    />
                                );
                            })}
                            {isEmptyDay && (
                                <div className={styles.empty}>
                                    <h1>Your day is empty</h1>
                                    <h2>Start by adding an event</h2>
                                    {namedEventRows.BREAKFAST}
                                    {namedEventRows.LUNCH}
                                    {namedEventRows.DINNER}
                                    <div className={styles.gap}>
                                        <button className={styles.addButton}>Add activity</button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </ScrollWrapper>
                </div>
            </>
        )
    );
};

export default Day;

type IPeriod = {
    start: number;
    end: number;
};

type IPeriodEvents = {
    period: IPeriod;
    events: IDayEvent[];
};

const getHours = (events: IDayEvent[], resolution: number, threshold: number): IPeriod[] => {
    const periods: IPeriod[] = [];

    events.forEach((event) => {
        const { hours, minutes } = minsToHoursAndMins(event.time);
        const startHour = hours + Math.floor(minutes / resolution) * (resolution / 60);
        const duration = event.duration;
        const endMinutes = hours * 60 + minutes + duration;
        const endHour = Math.ceil(endMinutes / resolution) * (resolution / 60);

        if (periods.length === 0 || periods[periods.length - 1].end + threshold / 60 <= startHour) {
            periods.push({ start: startHour, end: endHour });
        } else if (periods[periods.length - 1].end <= endHour) {
            periods[periods.length - 1].end = endHour;
        }
    });

    return periods;
};

const splitEvents = (events: IDayEvent[], resolution: number, threshold: number): IPeriodEvents[] => {
    const periods = getHours(events, resolution, threshold);
    const periodsAndEvents: IPeriodEvents[] = [];

    periods.forEach((period) => {
        const startMinutes = period.start * 60;
        const endMinutes = period.end * 60;
        const periodEvents: IDayEvent[] = [];

        events.forEach((event) => {
            const { hours, minutes } = minsToHoursAndMins(event.time);
            const eventStartMinutes = hours * 60 + minutes;
            const eventEndMinutes = eventStartMinutes + event.duration;

            if (eventStartMinutes < endMinutes && eventEndMinutes > startMinutes) {
                periodEvents.push(event);
            }
        });

        periodsAndEvents.push({ period: period, events: periodEvents });
    });

    return periodsAndEvents;
};

const formatGapDuration = (currentEventEnd: number, nextEventStart?: number): string | null => {
    if (!nextEventStart) {
        return null;
    }

    const gap = nextEventStart - currentEventEnd;

    const hours = gap >= 1 ? `${Math.floor(gap)} hour${gap >= 2 ? 's' : ''}` : null;
    const mins = gap % 1 > 0 ? `${Math.floor((gap % 1) * 60)} mins` : null;
    return `+${hours ? ' ' + hours : ''}${mins ? ' ' + mins : ''}` || null;
};
