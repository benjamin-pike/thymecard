import { FC } from 'react';
import { DateTime, Duration } from 'luxon';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { IEvent } from '@/lib/global.types';
import { BiPlus } from 'react-icons/bi';
import { formatClasses } from '@/lib/common.utils';
import styles from './day.module.scss';

interface IDayProps {
    data: IEvent[];
    date: DateTime | null;
}

const Day: FC<IDayProps> = ({ data, date }) => {
    const isEmptyDay = data.length === 0;
    const periods = splitEvents(data, 15, 30);

    const hasBreakfast = data.some((event) => event.type === 'breakfast');
    const hasLunch = data.some((event) => event.type === 'lunch');
    const hasDinner = data.some((event) => event.type === 'dinner');

    return (
        date && (
            <div className={styles.wrapper}>
                <ScrollWrapper height={'100%'} padding={1} buttonMargin={{ up: '1px' }}>
                    <section className={styles.day}>
                        <Header date={date} displayButtons={data.length > 0} />
                        {periods.map(({ period, events }, index) => {
                            const gap = formatGapDuration(period.end, periods[index + 1]?.period.start);

                            const addNamedEventButtons = getNamedEventButtons(periods, index, {
                                breakfast: !hasBreakfast,
                                lunch: !hasLunch,
                                dinner: !hasDinner
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
                                />
                            );
                        })}
                        {isEmptyDay && (
                            <div className={styles.emptyDay}>
                                <h1>Your day is empty!</h1>
                                <h2>Start by adding an event</h2>
                                {namedEventRows.breakfast}
                                {namedEventRows.lunch}
                                {namedEventRows.dinner}
                                <div className={styles.gap}>
                                    <button className={formatClasses(styles, ['addEvent', 'named', 'pill'])}>Add activity</button>
                                </div>
                            </div>
                        )}
                    </section>
                </ScrollWrapper>
            </div>
        )
    );
};

export default Day;

interface IHeaderProps {
    date: DateTime;
    displayButtons: boolean;
}

const Header: FC<IHeaderProps> = ({ date, displayButtons }) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.date}>
                <span className={styles.dateDay}>{date.toFormat('cccc')}</span>
                <span>{date.toFormat('d')}</span>
                <span className={styles.dateMonth}>{date.toFormat('MMMM')}</span>
            </h1>
            {displayButtons && (
                <div className={styles.buttons}>
                    <button>
                        <strong>Add</strong> Event
                    </button>
                    <button>
                        <strong>Copy</strong> Day
                    </button>
                    <button>
                        <strong>Clear</strong> Day
                    </button>
                </div>
            )}
        </header>
    );
};

interface IPeriodProps {
    events: IEvent[];
    period: { start: number; end: number };
    gap: string | null;
    isFinalPeriod: boolean;
    addNamedEventButtons: {
        before: JSX.Element[];
        middle: JSX.Element[];
        after: JSX.Element[];
    };
}

const Period: FC<IPeriodProps> = ({ events, period, gap, isFinalPeriod, addNamedEventButtons }) => {
    const length = period.end - period.start;
    const hasMultipleMiddleButtons = addNamedEventButtons.middle.length !== 1;

    return (
        <>
            {...addNamedEventButtons.before}

            <div className={styles.period} style={{ height: `${length * 8}rem` }}>
                {Array.from({ length: length * 4 + 1 }).map((_, i) => (
                    <GridLine key={i} startHour={period.start} i={i} periodLength={length} />
                ))}

                {events.map((event) => {
                    const duration = Duration.fromObject({ minutes: event.duration })
                        .toFormat("h'h' mm'm'")
                        .replace(new RegExp('^0h'), '')
                        .replace(new RegExp('00m$'), '');

                    return (
                        <div
                            key={JSON.stringify(event)}
                            className={styles.event}
                            data-type = {event.type}
                            style={{
                                top: `calc(${timeToPercent(event.time, period.start, length)}% + 1px)`,
                                height: `calc(${durationToPercent(event.duration, length)}% - 1px)`
                            }}
                        >
                            <p className={styles.eventName}>{event.name}</p>
                            <p className={styles.eventTime}>
                                {event.time} • {duration}
                            </p>
                        </div>
                    );
                })}
            </div>

            {!isFinalPeriod && (
                <div className={styles.gap}>
                    <p className={styles.pill}>{gap}</p>
                    {!hasMultipleMiddleButtons ? (
                        addNamedEventButtons.middle[0]
                    ) : (
                        <button className={formatClasses(styles, ['addEvent', 'generic'] )}>
                            <BiPlus />
                        </button>
                    )}
                </div>
            )}

            {hasMultipleMiddleButtons && [...addNamedEventButtons.middle]}
            {[...addNamedEventButtons.after]}
        </>
    );
};

interface IGridLineProps {
    startHour: number;
    periodLength: number;
    i: number;
}

const GridLine: FC<IGridLineProps> = ({ i, startHour, periodLength }) => {
    const decimalTime = startHour + i / 4;
    const quarterHourLabel = ((decimalTime % 1) * 60).toString().padStart(2, '0');

    return (
        <div className={styles.hour} style={{ top: `${(i / (periodLength * 4)) * 100}%` }}>
            <span className={styles.label}>{`${Math.floor(decimalTime)}:${quarterHourLabel}`}</span>
            <div className={styles.line} />
        </div>
    );
};

type IPeriod = {
    start: number;
    end: number;
};

type IPeriodEvents = {
    period: IPeriod;
    events: IEvent[];
};

const getHours = (events: IEvent[], resolution: number, threshold: number): IPeriod[] => {
    let periods: IPeriod[] = [];

    events.forEach((event) => {
        let [hour, minutes] = event.time.split(':').map(Number);
        let startHour = hour + Math.floor(minutes / resolution) * (resolution / 60);
        let duration = event.duration;
        let endMinutes = hour * 60 + minutes + duration;
        let endHour = Math.ceil(endMinutes / resolution) * (resolution / 60);

        if (periods.length === 0 || periods[periods.length - 1].end + threshold / 60 <= startHour) {
            periods.push({ start: startHour, end: endHour });
        } else if (periods[periods.length - 1].end <= endHour) {
            periods[periods.length - 1].end = endHour;
        }
    });

    return periods;
};

const splitEvents = (events: IEvent[], resolution: number, threshold: number): IPeriodEvents[] => {
    let periods = getHours(events, resolution, threshold);
    let periodsAndEvents: IPeriodEvents[] = [];

    periods.forEach((period) => {
        let startMinutes = period.start * 60;
        let endMinutes = period.end * 60;
        let periodEvents: IEvent[] = [];

        events.forEach((event) => {
            let [hour, minutes] = event.time.split(':').map(Number);
            let eventStartMinutes = hour * 60 + minutes;
            let eventEndMinutes = eventStartMinutes + event.duration;

            if (eventStartMinutes < endMinutes && eventEndMinutes > startMinutes) {
                periodEvents.push(event);
            }
        });

        periodsAndEvents.push({ period: period, events: periodEvents });
    });

    return periodsAndEvents;
};

const timeToPercent = (time: string, periodStart: number, periodLength: number): number => {
    const [hour, minute] = time.split(':').map(Number);
    const adjustedHour = hour - periodStart;
    return ((adjustedHour * 60 + minute) * 50) / (periodLength * 30);
};

const durationToPercent = (duration: number, periodLength: number): number => {
    return (duration * 100) / (periodLength * 60);
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

const namedEventButtons = {
    breakfast: (
        <button key="addBreakfastButton" className={formatClasses(styles, ['addEvent', 'named', 'pill'])}>
            Add breakfast
        </button>
    ),
    lunch: (
        <button key="addLunchButton" className={formatClasses(styles, ['addEvent', 'named', 'pill'])}>
            Add lunch
        </button>
    ),
    dinner: (
        <button key="addDinnerButton" className={formatClasses(styles, ['addEvent', 'named', 'pill'])}>
            Add dinner
        </button>
    )
};

const namedEventRows = {
    breakfast: (
        <div key="addBreakfastRow" className={styles.gap}>
            {namedEventButtons.breakfast}
        </div>
    ),
    lunch: (
        <div key="addLunchRow" className={styles.gap}>
            {namedEventButtons.lunch}
        </div>
    ),
    dinner: (
        <div key="addDinnerRow" className={styles.gap}>
            {namedEventButtons.dinner}
        </div>
    )
};

const getNamedEventButtons = (
    periods: IPeriodEvents[],
    index: number,
    required: { breakfast: boolean; lunch: boolean; dinner: boolean }
) => {
    const events = ['breakfast', 'lunch', 'dinner'] as const;
    const eventTimes = {
        breakfast: 9,
        lunch: 13,
        dinner: 19
    };

    const periodEndsAfter = (hour: number) => periods.findIndex((p) => p.period.end > hour);
    const periodStartsAfter = (hour: number) => periods.findIndex((p) => p.period.start > hour);

    const requiredEvents = events.filter((event) => required[event]);

    const before = requiredEvents.filter((event) => periodEndsAfter(eventTimes[event]) === 0 && index === 0);
    const middle = requiredEvents.filter((event) => periodStartsAfter(eventTimes[event]) === index + 1 && !before.includes(event));
    const after = requiredEvents.filter(
        (event) =>
            (periodEndsAfter(eventTimes[event]) === -1 || periodEndsAfter(eventTimes[event]) === index) &&
            periodStartsAfter(eventTimes[event]) !== index &&
            index === periods.length - 1
    );

    return {
        before: before.map((event) => namedEventRows[event]),
        middle: middle.map((event) => (middle.length > 1 ? namedEventRows[event] : namedEventButtons[event])),
        after: after.map((event) => namedEventRows[event])
    };
};
