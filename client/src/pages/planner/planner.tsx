import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useToggle } from '@mantine/hooks';

import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { useWindowResize } from '@/hooks/common/useWindowResize';
import { useMount } from '@/hooks/common/useMount';
import { useBreakpoints } from '@/hooks/common/useBreakpoints';
import { usePlan } from '@/components/providers/PlanProvider';

import ControlBar from '@/components/planner/controls/Controls';
import Day from '@/components/planner/day/Day';
import Month from '@/components/planner/month/Month';
import DrawerWrapper, { IDrawerWrapperProps } from '@/components/wrappers/drawer/DrawerWrapper';

import { EEventDisplayFormat } from '@/components/planner/planner.types';
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
        handleSelectDay,
        handleMonthBackward,
        handleMonthForward,
        handleDayForward,
        handleDayBackward,
        handleToday,
        handleClearDay
    } = usePlan();

    const [displayMeals, setDisplayMeals] = useState<boolean>(true);
    const [displayActivities, setDisplayActivities] = useState<boolean>(true);
    const [displayTime, setDisplayTime] = useState<boolean>(true);

    const [eventDisplayFormat, toggleEventDisplayFormat] = useToggle([
        EEventDisplayFormat.COMPACT,
        EEventDisplayFormat.SIMPLE,
        EEventDisplayFormat.STRIP
    ] as const);

    const [displayDayView, setDisplayDayView] = useState(false);

    const nullifyDayTimeout = useRef<number | null>(null);

    const handleDayClick = useCallback(
        (date: DateTime) => {
            handleSelectDay(date);

            if (!displayDayView) {
                setDisplayDayView(true);
            }
        },
        [displayDayView, handleSelectDay]
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

    const handleEventDisplayFormat = useCallback(() => {
        toggleEventDisplayFormat();
    }, [toggleEventDisplayFormat]);

    const handleTime = useCallback(() => {
        setDisplayTime(!displayTime);
    }, [displayTime]);

    const closeDrawer = useCallback(() => {
        setDisplayDayView(false);

        nullifyDayTimeout.current = setTimeout(() => {
            handleClearDay();
        }, 500);
    }, [handleClearDay]);

    const checkDayDrawerVisibility = useCallback(() => {
        if (viewport.isSmallerThan('large')) {
            if (displayDayView) {
                setDisplayDayView(false);
                handleClearDay();
            }
        }
    }, [displayDayView, handleClearDay, viewport]);

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
                        eventDisplayFormat={eventDisplayFormat}
                        handleMonthBackward={handleMonthBackward}
                        handleMonthForward={handleMonthForward}
                        toggleMeals={handleMeals}
                        toggleActivities={handleActivities}
                        toggleDisplayFormat={handleEventDisplayFormat}
                        toggleTime={handleTime}
                        handleToday={handleToday}
                    />
                    <Day data={selectedDay ? selectedDay.events : []} date={selectedDay.date} />
                </div>
            </DrawerWrapper>
            <div className={formatClasses(styles, ['column', 'right'])}>
                <Month
                    currentDay={selectedDay.date}
                    currentMonth={selectedMonth}
                    displayActivities={displayActivities}
                    displayMeals={displayMeals}
                    displayTime={displayTime}
                    eventDisplayFormat={eventDisplayFormat}
                    handleDayClick={handleDayClick}
                />
            </div>
        </main>
    );
};

export default Planner;
