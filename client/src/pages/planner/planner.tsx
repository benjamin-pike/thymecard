import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';

import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { useWindowResize } from '@/hooks/common/useWindowResize';
import { useMount } from '@/hooks/common/useMount';
import { useBreakpoints } from '@/hooks/common/useBreakpoints';
import { usePlan } from '@/components/providers/PlanProvider';
import { useModal } from '@/hooks/common/useModal';

import ControlBar from '@/components/planner/controls/Controls';
import Day from '@/components/planner/day/Day';
import Month from '@/components/planner/month/Month';
import DrawerWrapper, { IDrawerWrapperProps } from '@/components/wrappers/drawer/DrawerWrapper';
import AddEventModal from '@/components/planner/modals/AddEventModal';
import CopyEventsModal from '@/components/planner/modals/CopyEventsModal';
import ClearEventsModal from '@/components/planner/modals/ClearEventsModal';
import EditEventModal from '@/components/planner/modals/EditEventModal';
import BookmarkEventModal from '@/components/planner/modals/BookmarkEventModal';

import { EEventType } from '@thymecard/types';
import { formatClasses } from '@/lib/common.utils';

import styles from './planner.module.scss';

const TODAY = DateTime.now().startOf('day');

const Planner = () => {
    const viewport = useBreakpoints([
        { name: 'oneColumn', min: 0, max: 479 },
        { name: 'twoColumns', min: 480, max: 600 },
        { name: 'threeColumns', min: 601, max: 800 },
        { name: 'sevenColumns', min: 801, max: 10000 }
    ]);

    const {
        plan,
        selectedDay,
        selectedMonth,
        selectedEvent,
        handleSelectDay,
        handleMonthBackward,
        handleMonthForward,
        handleDayForward,
        handleDayBackward,
        handleToday,
        handleDeselectDay,
        handleSelectEvent
    } = usePlan();

    const [displayMeals, setDisplayMeals] = useState<boolean>(true);
    const [displayActivities, setDisplayActivities] = useState<boolean>(true);
    const [displayTime, setDisplayTime] = useState<boolean>(true);

    const [displayDayView, setDisplayDayView] = useState(false);

    const nullifyDayTimeout = useRef<number | null>(null);

    const [newEventType, setNewEventType] = useState<EEventType | null>(null);
    const [newEventTime, setNewEventTime] = useState<number | null>(null);

    const {
        modalState: addEventModalState,
        isModalClosed: isAddEventModalClosed,
        openModal: openAddEventModal,
        closeModal: closeAddEventModal
    } = useModal();

    const {
        modalState: copyEventsModalState,
        isModalClosed: isCopyEventsModalClosed,
        openModal: openCopyEventsModal,
        closeModal: closeCopyEventsModal
    } = useModal();

    const {
        modalState: clearEventsModalState,
        isModalClosed: isClearEventsModalClosed,
        openModal: openClearEventsModal,
        closeModal: closeClearEventsModal
    } = useModal();

    const {
        modalState: editEventModalState,
        isModalClosed: isEditEventModalClosed,
        openModal: openEditEventModal,
        closeModal: closeEditEventModal
    } = useModal();

    const {
        modalState: bookmarkEventModalState,
        isModalClosed: isBookmarkEventModalClosed,
        openModal: openBookmarkEventModal,
        closeModal: closeBookmarkEventModal
    } = useModal();

    const handleOpenAddEventModal = useCallback(
        (type: EEventType | null, time: number | null) => () => {
            openAddEventModal();

            if (type) {
                setNewEventType(type);
            }
            if (time) {
                setNewEventTime(time);
            }
        },
        [openAddEventModal]
    );

    const handleCloseAddEventModal = useCallback(() => {
        closeAddEventModal();

        if (newEventType) {
            setNewEventType(null);
        }
        if (newEventTime) {
            setNewEventTime(null);
        }
    }, [closeAddEventModal, newEventTime, newEventType]);

    const handleOpenCopyEventsModal = useCallback(() => {
        openCopyEventsModal();
    }, [openCopyEventsModal]);

    const handleCloseCopyEventsModal = useCallback(() => {
        closeCopyEventsModal();
    }, [closeCopyEventsModal]);

    const handleOpenClearEventsModal = useCallback(() => {
        openClearEventsModal();
    }, [openClearEventsModal]);

    const handleCloseClearEventsModal = useCallback(() => {
        closeClearEventsModal();
    }, [closeClearEventsModal]);

    const handleOpenEditEventModal = useCallback(() => {
        openEditEventModal();
    }, [openEditEventModal]);

    const handleCloseEditEventModal = useCallback(() => {
        closeEditEventModal();
    }, [closeEditEventModal]);

    const handleOpenBookmarkEventModal = useCallback(() => {
        openBookmarkEventModal();
    }, [openBookmarkEventModal]);

    const handleCloseBookmarkEventModal = useCallback(() => {
        closeBookmarkEventModal();
    }, [closeBookmarkEventModal]);

    const handleDayClick = useCallback(
        (date: DateTime) => () => {
            handleSelectDay(date);

            if (!displayDayView) {
                setDisplayDayView(true);
            }
        },
        [displayDayView, handleSelectDay]
    );

    const handleDayDoubleClick = useCallback(
        (date: DateTime) => () => {
            handleSelectDay(date);
            openAddEventModal();
        },
        [handleSelectDay, openAddEventModal]
    );

    const handleEventClick = useCallback(
        (eventId: string) => () => {
            handleSelectEvent(eventId);
            handleOpenEditEventModal();
        },
        [handleOpenEditEventModal, handleSelectEvent]
    );

    const handleBookmarkClick = useCallback(
        (eventId: string) => () => {
            handleSelectEvent(eventId);
            handleOpenBookmarkEventModal();
        },
        [handleOpenBookmarkEventModal, handleSelectEvent]
    );

    const handleMeals = useCallback(() => {
        if (displayMeals && !displayActivities) {
            setDisplayActivities(true);
        }
        setDisplayMeals(!displayMeals);
    }, [displayMeals, displayActivities]);

    const handleActivities = useCallback(() => {
        if (displayActivities && !displayMeals) {
            setDisplayMeals(true);
        }
        setDisplayActivities(!displayActivities);
    }, [displayActivities, displayMeals]);

    const handleTime = useCallback(() => {
        setDisplayTime(!displayTime);
    }, [displayTime]);

    const closeDrawer = useCallback(() => {
        setDisplayDayView(false);

        nullifyDayTimeout.current = setTimeout(() => {
            handleDeselectDay();
        }, 500);
    }, [handleDeselectDay]);

    const checkDayDrawerVisibility = useCallback(() => {
        if (viewport.isSmallerThan('large')) {
            if (displayDayView) {
                setDisplayDayView(false);
                handleDeselectDay();
            }
        }
    }, [displayDayView, handleDeselectDay, viewport]);

    useWindowResize(checkDayDrawerVisibility);
    useMount(checkDayDrawerVisibility);

    useWindowKeyDown('ArrowLeft', handleDayBackward);
    useWindowKeyDown('ArrowRight', handleDayForward);
    useWindowKeyDown('ArrowUp', handleMonthBackward);
    useWindowKeyDown('ArrowDown', handleMonthForward);
    useWindowKeyDown('Escape', () => {
        if (viewport.isSmallerThan('large')) {
            closeDrawer();
        }
    });

    const drawerWrapperProps: Omit<IDrawerWrapperProps, 'children'> = useMemo(() => {
        const position = viewport.current.isThreeColumns || viewport.current.isSevenColumns ? 'left' : 'bottom';
        return {
            direction: position,
            transitionDuration: 200,
            margin: position === 'left' ? { closed: -0.1, open: 0 } : { closed: 4, open: 0 },
            isVisible: displayDayView,
            isActive: viewport.isSmallerThan('large'),
            closeDrawer: closeDrawer
        };
    }, [viewport, displayDayView, closeDrawer]);

    useEffect(() => {
        if (selectedDay && nullifyDayTimeout.current) {
            clearTimeout(nullifyDayTimeout.current);
        }
    }, [selectedDay, nullifyDayTimeout]);

    useEffect(() => {
        if (viewport.isLargerThan('medium')) {
            if (!selectedDay) {
                handleSelectDay(TODAY);
            }

            if (!displayDayView) {
                setDisplayDayView(true);
            }
        }
    }, [displayDayView, handleSelectDay, plan, selectedDay, viewport]);

    return (
        <main className={formatClasses(styles, ['content', displayDayView ? 'dayOverlay' : ''])} data-viewport={viewport.getCurrentSize()}>
            <DrawerWrapper {...drawerWrapperProps}>
                <div className={formatClasses(styles, ['column', 'left'])}>
                    <ControlBar
                        currentMonth={selectedMonth}
                        displayActivities={displayActivities}
                        displayMeals={displayMeals}
                        displayTime={displayTime}
                        handleMonthBackward={handleMonthBackward}
                        handleMonthForward={handleMonthForward}
                        toggleMeals={handleMeals}
                        toggleActivities={handleActivities}
                        toggleTime={handleTime}
                        handleToday={handleToday}
                    />
                    <Day
                        data={selectedDay ? selectedDay.events : []}
                        date={selectedDay.date}
                        handleOpenAddEventModal={handleOpenAddEventModal}
                        handleOpenCopyEventsModal={handleOpenCopyEventsModal}
                        handleOpenClearEventsModal={handleOpenClearEventsModal}
                        handleOpenEditEventModal={handleEventClick}
                        handleOpenBookmarkEventModal={handleBookmarkClick}
                    />
                </div>
            </DrawerWrapper>
            <div className={formatClasses(styles, ['column', 'right'])}>
                <Month
                    currentDay={selectedDay.date}
                    currentMonth={selectedMonth}
                    displayActivities={displayActivities}
                    displayMeals={displayMeals}
                    displayTime={displayTime}
                    handleDayClick={handleDayClick}
                    handleDayDoubleClick={handleDayDoubleClick}
                    handleEventClick={handleEventClick}
                />
            </div>
            <AddEventModal
                key={isAddEventModalClosed.toString()}
                state={addEventModalState}
                date={selectedDay?.date ?? TODAY}
                type={newEventType ?? undefined}
                time={newEventTime ?? undefined}
                handleCloseModal={handleCloseAddEventModal}
            />
            <CopyEventsModal
                key={isCopyEventsModalClosed.toString()}
                state={copyEventsModalState}
                handleCloseModal={handleCloseCopyEventsModal}
            />
            <ClearEventsModal
                key={isClearEventsModalClosed.toString()}
                state={clearEventsModalState}
                handleCloseModal={handleCloseClearEventsModal}
            />
            {selectedEvent && (
                <EditEventModal
                    key={isEditEventModalClosed.toString()}
                    state={editEventModalState}
                    handleCloseModal={handleCloseEditEventModal}
                />
            )}
            {selectedEvent && (
                <BookmarkEventModal
                    key={isBookmarkEventModalClosed.toString()}
                    state={bookmarkEventModalState}
                    handleCloseModal={handleCloseBookmarkEventModal}
                />
            )}
        </main>
    );
};

export default Planner;
