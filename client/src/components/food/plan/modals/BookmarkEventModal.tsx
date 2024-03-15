import { FC, useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';

import ModalCard from '@/components/common/modal-card/ModalCard';
import Checkbox from '@/components/common/checkbox/Checkbox';

import { usePlan } from '../../../providers/PlanProvider';
import { ModalState } from '@/hooks/common/useModal';

import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import { isDefined, isMealEvent } from '@thymecard/types';
import { formatDuration, minsToHoursAndMins } from '@thymecard/utils';
import { createToast } from '@/lib/toast/toast.utils';

import styles from './bookmark-event-modal.module.scss';

const BookmarkIcon = ICONS.recipes.bookmark;
const TypeIcon = ICONS.common.dropdown;
const TimeIcon = ICONS.common.time;
const DurationIcon = ICONS.common.duration;
const CaloriesIcon = ICONS.common.pieChart;
const ServingsIcon = ICONS.recipes.servings;
const RecipeIcon = ICONS.common.recipe;
const FavoriteIcon = ICONS.common.star;
const TickIcon = ICONS.common.tick;
const CrossIcon = ICONS.common.XLarge;

interface IBookmarkEventModalProps {
    state: ModalState;
    handleCloseModal: () => void;
}

const BookmarkEventModal: FC<IBookmarkEventModalProps> = ({ state, handleCloseModal }) => {
    const { selectedDay, selectedEvent, handleBookmarkEvent } = usePlan();

    if (selectedEvent && !isMealEvent(selectedEvent)) {
        throw new Error('Selected event is not a meal event');
    }

    const [name, setName] = useState('');
    const [includeType, setIncludeType] = useState(true);
    const [includeTime, setIncludeTime] = useState(true);
    const [includeDuration, setIncludeDuration] = useState(true);
    const [excludedItems, setExcludedItems] = useState<string[]>([]);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

    const time = useMemo(() => {
        if (!selectedEvent?.time) {
            return;
        }

        const { hours, minutes } = minsToHoursAndMins(selectedEvent.time);

        return DateTime.local().set({ hour: hours, minute: minutes });
    }, [selectedEvent]);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const handleIncludeType = useCallback(() => {
        setIncludeType((prev) => !prev);
    }, []);

    const handleIncludeTime = useCallback(() => {
        setIncludeTime((prev) => !prev);
    }, []);

    const handleIncludeDuration = useCallback(() => {
        setIncludeDuration((prev) => !prev);
    }, []);

    const handleToggleEventItem = useCallback(
        (itemId: string) => () => {
            setExcludedItems((prev) => {
                if (prev.includes(itemId)) {
                    return prev.filter((e) => e !== itemId);
                }

                return [...prev, itemId];
            });
        },
        []
    );

    const handleCopyClick = useCallback(async () => {
        setIsBookmarkLoading(true);

        try {
            await handleBookmarkEvent(name, includeType, includeTime, includeDuration, excludedItems);

            setIsBookmarkLoading(false);

            createToast('success', 'Event bookmarked successfully');

            handleCloseModal();
        } catch (err: any) {
            createToast('error', err.message);
        }
    }, [excludedItems, handleBookmarkEvent, handleCloseModal, includeDuration, includeTime, includeType, name]);

    if (!selectedDay || !selectedEvent) return null;

    return (
        <ModalCard
            title="Bookmark Event"
            state={state}
            blurBackground={true}
            buttons={[
                {
                    text: 'Add Bookmark',
                    type: 'primary',
                    loadingText: 'Bookmarking…',
                    disabled: !name || excludedItems.length === selectedEvent?.items.length,
                    isLoading: isBookmarkLoading,
                    onClick: handleCopyClick
                },
                {
                    text: 'Cancel',
                    type: 'secondary',
                    onClick: handleCloseModal
                }
            ]}
            handleCloseModal={handleCloseModal}
        >
            <section className={styles.body}>
                <div className={styles.name} data-empty={!name}>
                    <BookmarkIcon />
                    <input value={name} placeholder="Enter a name for this bookmark" onChange={handleNameChange} />
                </div>
                <ul className={styles.eventMetadata}>
                    <li className={styles.type} data-type={selectedEvent?.type}>
                        <div className={styles.checkbox}>
                            <Checkbox id="type" checked={includeType} onClick={handleIncludeType} />
                            <label htmlFor="type">
                                <TypeIcon />
                                <span className={styles.value}>{capitalize(selectedEvent?.type ?? '')}</span>
                            </label>
                        </div>
                    </li>
                    <div className={styles.separator} />
                    <li className={styles.time}>
                        <div className={styles.checkbox}>
                            <Checkbox id="time" checked={includeTime} onClick={handleIncludeTime} />
                            <label htmlFor="time">
                                <TimeIcon />
                                <span className={styles.value}>{time?.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                            </label>
                        </div>
                    </li>
                    <div className={styles.separator} />
                    <li className={styles.duration}>
                        <div className={styles.checkbox}>
                            <Checkbox id="duration" checked={includeDuration} onClick={handleIncludeDuration} />
                            <label htmlFor="duration">
                                <DurationIcon />
                                <span className={styles.value}>
                                    {selectedEvent?.duration && formatDuration(selectedEvent.duration, 'medium')}
                                </span>
                            </label>
                        </div>
                    </li>
                </ul>
                <ul className={styles.items}>
                    {selectedEvent?.items.map((item, index) => (
                        <li key={index} className={styles.item}>
                            <div className={styles.checkbox}>
                                <Checkbox
                                    id={item.id}
                                    checked={!excludedItems.includes(item.id)}
                                    onClick={handleToggleEventItem(item.id)}
                                />
                                <label htmlFor={item.id}>{item.name}</label>
                            </div>
                            <ul className={styles.itemMetadata}>
                                <li>
                                    <CaloriesIcon className={styles.icon} />
                                    {item.calories} calorie{item.calories || 0 > 1 ? 's' : ''}
                                </li>
                                <div className={styles.separator} />
                                <li>
                                    <ServingsIcon className={styles.icon} />
                                    {item.servings} serving{item.servings > 1 ? 's' : ''}
                                </li>
                                <div className={styles.separator} />
                                <li>
                                    <RecipeIcon className={styles.icon} />
                                    {isDefined(item.recipeId) ? (
                                        <TickIcon className={styles.tick} />
                                    ) : (
                                        <CrossIcon className={styles.cross} />
                                    )}
                                </li>
                                <div className={styles.separator} />
                                <li>
                                    <FavoriteIcon className={styles.icon} />
                                    {item.isFavorite ? <TickIcon className={styles.tick} /> : <TickIcon className={styles.tick} />}
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </section>
        </ModalCard>
    );
};

export default BookmarkEventModal;
