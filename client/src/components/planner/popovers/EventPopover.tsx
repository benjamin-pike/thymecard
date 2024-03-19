import { FC, useCallback, useMemo } from 'react';
import EventIcon from '@/components/common/event-icon/EventIcon';
import { Client, IDayEvent, isDefined, isMealEvent, isNull } from '@thymecard/types';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import styles from './event-popover.module.scss';
import { usePopoverContext } from '@/components/wrappers/popover/Popover';
import { usePlan } from '@/components/providers/PlanProvider';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { formatTimeM } from '@thymecard/utils';

const TimeIcon = ICONS.common.time;
const CaloriesIcon = ICONS.common.pieChart;
const EditIcon = ICONS.recipes.create;
const BookmarkIcon = ICONS.recipes.bookmark;
const RemoveIcon = ICONS.common.XLarge;

interface IEventPopoverProps {
    event: Client<IDayEvent>;
    handleOpenEditEventModal: () => void;
    handleOpenBookmarkEventModal: () => void;
}

const EventPopover: FC<IEventPopoverProps> = ({ event, handleOpenEditEventModal, handleOpenBookmarkEventModal }) => {
    const { selectedDay } = usePlan();
    const { handleClosePopover } = usePopoverContext();
    const { handleDeleteEvent } = usePlan();

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

    const handleDeleteEventClick = useCallback(
        (deleteEvent: () => void) => () => {
            deleteEvent();
            handleClosePopover();
        },
        [handleClosePopover]
    );

    return (
        <div key={JSON.stringify(event)} className={styles.event} data-type={event.type}>
            <header className={styles.header}>
                <div className={styles.type}>
                    <EventIcon className={styles.icon} type={event.type} radius={0.95} background={true} />
                    <p>{capitalize(event.type)}</p>
                </div>
                <span className={styles.buttons}>
                    <button
                        className={styles.edit}
                        data-tooltip-id="tooltip-edit-event"
                        data-tooltip-content="Edit Event"
                        onClick={handleEditButtonClick}
                    >
                        <EditIcon />
                    </button>
                    <button
                        className={styles.bookmark}
                        data-tooltip-id="tooltip-bookmark-event"
                        data-tooltip-content="Bookmark Event"
                        onClick={handleBookmarkButtonClick}
                    >
                        <BookmarkIcon />
                    </button>
                    <button
                        className={styles.remove}
                        data-tooltip-id="tooltip-remove-event"
                        data-tooltip-content="Remove Event"
                        onClick={handleDeleteEventClick(handleDeleteEvent(event._id))}
                    >
                        <RemoveIcon />
                    </button>
                </span>
            </header>
            <div className={styles.divider} />
            <p className={styles.metadata}>
                <TimeIcon />

                <span>{selectedDay.date?.toFormat('cccc, d LLLL')}</span>
                <span>•</span>
                <span>
                    {formatTimeM(event.time)} - {formatTimeM(event.time + event.duration)}
                </span>
            </p>
            <ul className={styles.items}>
                {event.items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        <p className={styles.name}>{item.name}</p>
                        {isDefined(item.calories) && !isNull(item.calories) && (
                            <span className={styles.calories}>
                                {item.calories * ('servings' in item && item.servings ? item.servings : 1)} kcal
                            </span>
                        )}
                    </li>
                ))}
                {event.items.length > 1 && (
                    <p className={styles.total}>
                        <span className={styles.key}>Total</span>
                        <span className={styles.value}>
                            <CaloriesIcon />
                            {calories} kcal
                        </span>
                    </p>
                )}
            </ul>
            <Tooltip id="tooltip-edit-event" place="bottom" size="small" offset={12.5} />
            <Tooltip id="tooltip-bookmark-event" place="bottom" size="small" offset={12.5} />
            <Tooltip id="tooltip-remove-event" place="bottom" size="small" offset={12.5} />
        </div>
    );
};

export default EventPopover;
