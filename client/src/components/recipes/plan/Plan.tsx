import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import AddEventModal from './modals/AddEventModal';
import BookmarkEventModal from './modals/BookmarkEventModal';
import CopyDayModal from './modals/CopyDayModal';
import EditEventModal from './modals/EditEventModal';
import EventBookmarkQuickSearch from '@/components/quick-search/meal-event-bookmark/MealEventBookmarkQuickSearch';
import Event from './Event';
import Tooltip from '@/components/common/tooltip/Tooltip';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';

import { usePlan } from './PlanProvider';
import { useModal } from '@/hooks/common/useModal';
import { useQuickSearch } from '@/hooks/common/useQuickSearch';

import { ICONS } from '@/assets/icons';
import { Client, IMealEventBookmark, extractMealEvents, isDefined } from '@thymecard/types';

import styles from './plan.module.scss';

const AddIcon = ICONS.common.plus;
const CopyIcon = ICONS.common.copy;
const BookmarkIcon = ICONS.recipes.bookmark;
const StockIcon = ICONS.recipes.tickList;

const TODAY = DateTime.now();
interface IPlanProps {
    handleSelectRecipe: (recipeId: string) => void;
    handleToggleVisibleInfo: () => void;
}

const Plan: FC<IPlanProps> = ({ handleSelectRecipe, handleToggleVisibleInfo }) => {
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);
    const { plan, selectedDay, selectedEvent, handleSelectDay, handleSelectEvent, handleDeleteEvent, handleSelectEventItem } = usePlan();

    const bodyRef = useRef<HTMLUListElement>(null);

    const {
        modalState: addEventModalState,
        isModalOpen: isAddEventModalOpen,
        isModalClosed: isAddEventModalClosed,
        toggleModal: toggleAddEventModalState
    } = useModal();
    const { modalState: copyDayModalState, isModalClosed: isCopyDayModalClosed, toggleModal: toggleCopyDayModalState } = useModal();
    const { modalState: eventModalState, isModalClosed: isEditEventModalClosed, toggleModal: toggleEventModalState } = useModal();
    const { modalState: boomarkModalState, isModalClosed: isBookmarkModalClosed, toggleModal: toggleBookmarkModalState } = useModal();

    const {
        quickSearchState: bookmarkQuickSearchState,
        isQuickSearchClosed: isBookmarkQuickSeachClosed,
        toggleQuickSearchState: toggleBookmarkQuickSearchState
    } = useQuickSearch();

    const displaySwitchViewButton = customViewportSize === 'twoColumns';
    const events = useMemo(() => extractMealEvents(selectedDay.events), [selectedDay.events]);
    const date = useMemo(() => DateTime.fromISO(selectedDay.date), [selectedDay.date]);

    const isEmpty = useMemo(() => events.length === 0, [events]);

    const [bookmarkedEvent, setBookmarkedEvent] = useState<Client<IMealEventBookmark> | null>(null);

    const handleToggleAddEventModalVisibility = useCallback(() => {
        if (isAddEventModalOpen && bookmarkedEvent) {
            setBookmarkedEvent(null);
        }

        toggleAddEventModalState();
    }, [bookmarkedEvent, isAddEventModalOpen, toggleAddEventModalState]);

    const handleEditEventClick = useCallback(
        (eventId: string) => () => {
            handleSelectEvent(eventId);

            toggleEventModalState();
        },
        [handleSelectEvent, toggleEventModalState]
    );

    const handleBookmarkEventClick = useCallback(
        (eventId: string, isBookmarked: boolean) => () => {
            if (isBookmarked) {
                return;
            }

            handleSelectEvent(eventId);

            toggleBookmarkModalState();
        },
        [handleSelectEvent, toggleBookmarkModalState]
    );

    const handleToggleBookmarkQuickSearchState = useCallback(() => {
        toggleBookmarkQuickSearchState();
    }, [toggleBookmarkQuickSearchState]);

    const handleToggleCopyDayModalVisibility = useCallback(() => {
        if (isEmpty) {
            return;
        }

        toggleCopyDayModalState();
    }, [isEmpty, toggleCopyDayModalState]);

    const handleSelectBookmarkedEvent = useCallback(
        (bookmark: Client<IMealEventBookmark>) => {
            setBookmarkedEvent(bookmark);

            handleToggleAddEventModalVisibility();
        },
        [handleToggleAddEventModalVisibility]
    );

    useEffect(() => {
        if (!bodyRef.current) {
            return;
        }

        const scrollWrapperElement = bodyRef.current?.parentElement;
        const eventElements = Array.from(bodyRef.current.children) as HTMLDivElement[];

        if (!scrollWrapperElement) {
            return;
        }

        let hasScrolled = false;
        for (const eventElement of eventElements) {
            if (eventElement.attributes.getNamedItem('data-past')?.value === 'true') {
                scrollWrapperElement.scrollTo({ top: eventElement.offsetTop + eventElement.offsetHeight, behavior: 'smooth' });
                hasScrolled = true;
            } else {
                if (hasScrolled) {
                    return;
                }
                break;
            }
        }

        scrollWrapperElement.scrollTo({ top: 0, behavior: 'smooth' });
    }, [bodyRef]);

    return (
        <>
            <section className={styles.plan}>
                <div className={styles.selectedDay}>
                    <header className={styles.top}>
                        <p className={styles.date}>
                            <span className={styles.dateDay}>{date.toFormat('cccc')}</span>
                            <span>{date.toFormat('d')}</span>
                            <span className={styles.dateMonth}>{date.toFormat('MMMM')}</span>
                        </p>
                        <div className={styles.buttons}>
                            <button className={styles.addEvent} onClick={handleToggleAddEventModalVisibility}>
                                <AddIcon />
                                <p>Create Event</p>
                            </button>
                            <button
                                className={styles.addBookmarked}
                                data-tooltip-id={isEmpty ? undefined : 'add-bookmarked'}
                                data-tooltip-content={'Add Bookmarked Event'}
                                onClick={handleToggleBookmarkQuickSearchState}
                            >
                                <BookmarkIcon className={styles.bookmark} />
                                <AddIcon className={styles.add} />
                            </button>
                            <button
                                className={styles.copyDay}
                                data-tooltip-id={isEmpty ? undefined : 'copy-day'}
                                data-tooltip-content={isEmpty ? undefined : 'Copy Events'}
                                disabled={isEmpty}
                                onClick={handleToggleCopyDayModalVisibility}
                            >
                                <CopyIcon />
                            </button>
                        </div>
                        {displaySwitchViewButton && (
                            <button className={styles.switchView} onClick={handleToggleVisibleInfo}>
                                <StockIcon />
                            </button>
                        )}
                    </header>
                    <div className={styles.scrollContainer}>
                        <ScrollWrapper height={'100%'} padding={1.25}>
                            <ul ref={bodyRef} className={styles.body}>
                                {events.map((event, i) => (
                                    <Event
                                        key={i}
                                        {...event}
                                        isToday={selectedDay.index === 0}
                                        handleSelectRecipe={handleSelectRecipe}
                                        handleEditEventClick={handleEditEventClick(event._id)}
                                        handleBookmarkEventClick={handleBookmarkEventClick(event._id, isDefined(event.bookmarkId))}
                                        handleDeleteEventClick={handleDeleteEvent(event._id)}
                                        handleSelectEventItem={handleSelectEventItem(event._id)}
                                    />
                                ))}
                            </ul>
                        </ScrollWrapper>
                    </div>
                </div>
                <ul className={styles.daySelector}>
                    {!!plan &&
                        plan.map((day, i) => (
                            <li key={i} className={styles.day} data-selected={selectedDay.index === i}>
                                <button onClick={handleSelectDay(i)}>
                                    <p>
                                        <span>{TODAY.plus({ days: i }).toFormat('ccc')[0]}</span>
                                        <span className={styles.dividerText}>{'   |   '}</span>
                                        <span>{TODAY.plus({ days: i }).toFormat('d')}</span>
                                    </p>
                                    {!!day?.events.length && (
                                        <ul className={styles.events}>
                                            {day.events.map(({ type, items }, i) => (
                                                <li key={i} className={styles.event} data-event={type} data-items={items} />
                                            ))}
                                        </ul>
                                    )}
                                </button>
                            </li>
                        ))}
                    <div className={styles.bar} data-day={selectedDay.index} />
                </ul>
            </section>
            <AddEventModal
                key={isAddEventModalClosed.toString()}
                state={addEventModalState}
                date={date}
                bookmarkedEvent={bookmarkedEvent}
                handleCloseModal={handleToggleAddEventModalVisibility}
            />
            <CopyDayModal
                key={isCopyDayModalClosed.toString()}
                state={copyDayModalState}
                handleCloseModal={handleToggleCopyDayModalVisibility}
            />
            {selectedEvent && (
                <EditEventModal key={isEditEventModalClosed.toString()} state={eventModalState} handleCloseModal={toggleEventModalState} />
            )}
            <BookmarkEventModal
                key={isBookmarkModalClosed.toString()}
                state={boomarkModalState}
                handleCloseModal={toggleBookmarkModalState}
            />
            <EventBookmarkQuickSearch
                key={isBookmarkQuickSeachClosed.toString()}
                state={bookmarkQuickSearchState}
                handleClose={handleToggleBookmarkQuickSearchState}
                handleSelectResult={handleSelectBookmarkedEvent}
            />
            <Tooltip id="add-bookmarked" place="bottom" offset={10} size="small" />
            <Tooltip id="copy-day" place="bottom" offset={10} size="small" />
            <Tooltip id="favorite-meal-item" place="bottom" offset={10} size="small" />
            <Tooltip id="link-to-recipe" place="bottom" size="small" offset={10} />
            <Tooltip id="remove-meal-item" place="bottom" offset={10} size="small" />
        </>
    );
};

export default Plan;
