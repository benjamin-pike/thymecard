import { FC, useMemo } from 'react';
import { IDayEvent, isMealEvent } from '@thymecard/types';
import EventPopover from '../popovers/EventPopover';
import Popover from '@/components/wrappers/popover/Popover';
import EventIcon from '@/components/common/event-icon/EventIcon';
import { ICONS } from '@/assets/icons';
import { formatDuration, formatTimeM, minsToHoursAndMins } from '@thymecard/utils';
import styles from './event.module.scss';

const TimeIcon = ICONS.common.time;
const DurationIcon = ICONS.common.duration;

interface IEventProps {
    event: IDayEvent;
    period: { start: number; end: number };
    handleOpenEditEventModal: () => void;
    handleOpenBookmarkEventModal: () => void;
}

const Event: FC<IEventProps> = ({ event, period, handleOpenEditEventModal, handleOpenBookmarkEventModal }) => {
    const length = period.end - period.start;

    const calories = useMemo(() => {
        if (!isMealEvent(event)) {
            return;
        }

        return event.items.reduce((acc, item) => acc + (item.calories || 0) * item.servings, 0);
    }, [event]);

    return (
        <div
            key={JSON.stringify(event)}
            className={styles.event}
            data-type={event.type}
            data-width={event.duration === 15 ? 'narrow' : event.duration < 30 ? 'medium' : 'full'}
            style={{
                top: `calc(${timeToPercent(event.time, period.start, length)}% + 1px)`,
                height: `calc(${durationToPercent(event.duration, length)}% - 1px)`
            }}
        >
            <Popover
                className={styles.popover}
                content={
                    <EventPopover
                        event={event}
                        handleOpenEditEventModal={handleOpenEditEventModal}
                        handleOpenBookmarkEventModal={handleOpenBookmarkEventModal}
                    />
                }
                placement="right-start"
                fallbackPlacement="right"
                strategy="fixed"
                absoluteTrigger={true}
            >
                <div className={styles.content}>
                    <span className={styles.top}>
                        <EventIcon type={event.type} radius={0.45} background={false} />
                        <p className={styles.name}>{event.items[0].name}</p>
                        <span className={styles.calories}>{calories} kcal</span>
                    </span>
                    <p className={styles.metadata}>
                        <span className={styles.time}>
                            <TimeIcon className={styles.icon} /> {formatTimeM(event.time)}
                        </span>
                        <div className={styles.separator} />
                        <span className={styles.duration}>
                            <DurationIcon className={styles.icon} /> {formatDuration(event.duration, 'medium')}
                        </span>
                    </p>
                </div>
            </Popover>
        </div>
    );
};

export default Event;

const timeToPercent = (timeM: number, periodStart: number, periodLength: number): number => {
    const { hours, minutes } = minsToHoursAndMins(timeM);
    const adjustedHour = hours - periodStart;
    return ((adjustedHour * 60 + minutes) * 50) / (periodLength * 30);
};

const durationToPercent = (duration: number, periodLength: number): number => {
    return (duration * 100) / (periodLength * 60);
};
