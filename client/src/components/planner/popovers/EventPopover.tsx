import { FC, useCallback, useMemo } from 'react';
import EventIcon from '@/components/common/event-icon/EventIcon';
import { Client, IDayEvent, isDefined, isMealEvent, isNull } from '@thymecard/types';
import { formatDuration, formatTimeM } from '@thymecard/utils';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import styles from './event-popover.module.scss';
import { usePopoverContext } from '@/components/wrappers/popover/Popover';

const TimeIcon = ICONS.common.time;
const DurationIcon = ICONS.common.duration;
const CaloriesIcon = ICONS.common.pieChart;
const EditIcon = ICONS.recipes.create;
const BookmarkIcon = ICONS.recipes.bookmark;

interface IEventPopoverProps {
    event: Client<IDayEvent>;
    handleOpenEditEventModal: () => void;
    handleOpenBookmarkEventModal: () => void;
}

const EventPopover: FC<IEventPopoverProps> = ({ event, handleOpenEditEventModal, handleOpenBookmarkEventModal }) => {
    const { handleClosePopover } = usePopoverContext();

    const calories = useMemo(() => {
        if (!isMealEvent(event)) {
            return;
        }

        return event.items.reduce((acc, item) => acc + (item.calories || 0) * item.servings, 0);
    }, [event]);

    const handleEditButtonClick = useCallback(() => {
        handleOpenEditEventModal();
        handleClosePopover();
    }, [handleOpenEditEventModal, handleClosePopover]);

    const handleBookmarkButtonClick = useCallback(() => {
        handleOpenBookmarkEventModal();
        handleClosePopover();
    }, [handleOpenBookmarkEventModal, handleClosePopover]);

    return (
        <div key={JSON.stringify(event)} className={styles.event} data-type={event.type}>
            <header className={styles.header}>
                <div className={styles.type}>
                    <EventIcon type={event.type} radius={1} background={true} />
                    <p>{capitalize(event.type)}</p>
                </div>
                <span className={styles.buttons}>
                    <button className={styles.edit} onClick={handleEditButtonClick}>
                        <EditIcon />
                    </button>
                    <button className={styles.bookmark} onClick={handleBookmarkButtonClick}>
                        <BookmarkIcon />
                    </button>
                </span>
            </header>
            <p className={styles.metadata}>
                <span className={styles.metric} data-type="time">
                    <TimeIcon />
                    <div className={styles.separator} /> {formatTimeM(event.time)}
                </span>
                <span className={styles.metric} data-type="duration">
                    <DurationIcon />
                    <div className={styles.separator} /> {formatDuration(event.duration, 'medium')}
                </span>
                <span className={styles.metric} data-type="calories">
                    <CaloriesIcon />
                    <div className={styles.separator} />
                    {calories} kcal
                </span>
            </p>
            <ul className={styles.items}>
                {event.items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        <p className={styles.name}>{item.name}</p>
                        {isDefined(item.calories) && !isNull(item.calories) && (
                            <span className={styles.calories}>
                                <CaloriesIcon />
                                {item.calories * ('servings' in item && item.servings ? item.servings : 1)} kcal
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventPopover;
