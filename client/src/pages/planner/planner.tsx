import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useToggle } from '@mantine/hooks';
import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { useWindowResize } from '@/hooks/common/useWindowResize';
import { useMount } from '@/hooks/common/useMount';
import { useBreakpoints } from '@/hooks/common/useBreakpoints';

import ControlBar from '@/components/planner/controls/Controls';
import Day from '@/components/planner/day/Day';
import Month from '@/components/planner/month/Month';
import DrawerWrapper, { IDrawerWrapperProps } from '@/components/wrappers/drawer/DrawerWrapper';

import { EEventDisplayFormat } from '@/components/planner/planner.types';
import { formatClasses } from '@/lib/common.utils';
import { generateMockPlannerData } from '@/test/mock-data/planner';

import styles from './planner.module.scss';

const Planner = () => {
    const data = useMemo(() => generateMockPlannerData('2023-01-01', '2023-12-31', 1), []);
    const viewport = useBreakpoints([
        { name: 'oneColumn', min: 0, max: 479 },
        { name: 'twoColumns', min: 480, max: 600 },
        { name: 'threeColumns', min: 601, max: 800 },
        { name: 'sevenColumns', min: 801, max: 10000 }
    ]);
    const initailSelectedDay = viewport.current.isXLarge ? DateTime.local() : null;
    const [selectedDay, setSelectedDay] = useState<DateTime | null>(initailSelectedDay);
    const [selectedMonth, setSelectedMonth] = useState<DateTime>(DateTime.local());

    const [displayMeals, setDisplayMeals] = useState<boolean>(true);
    const [displayActivities, setDisplayActivities] = useState<boolean>(true);
    const [displayTime, setDisplayTime] = useState<boolean>(true);

    const [eventDisplayFormat, toggleEventDisplayFormat] = useToggle([
        EEventDisplayFormat.COMPACT,
        EEventDisplayFormat.SIMPLE,
        EEventDisplayFormat.STRIP,
        EEventDisplayFormat.EXPANDED
    ] as const);

    const [displayDayView, setDisplayDayView] = useState(false);

    const nullifyDayTimeout = useRef<number | null>(null);

    const handleMonthBackward = useCallback(() => {
        setSelectedMonth(selectedMonth.minus({ months: 1 }));
    }, [selectedMonth]);

    const handleMonthForward = useCallback(() => {
        setSelectedMonth(selectedMonth.plus({ months: 1 }));
    }, [selectedMonth]);

    const handleDayForward = useCallback(() => {
        if (!selectedDay) return;

        if (selectedDay.day === selectedDay.daysInMonth) {
            setSelectedMonth(selectedDay.plus({ days: 1 }));
        } else if (selectedDay.month !== selectedMonth.month) {
            setSelectedMonth(selectedDay);
        }

        setSelectedDay(selectedDay.plus({ days: 1 }));
    }, [selectedDay, selectedMonth]);

    const handleDayBackward = useCallback(() => {
        if (!selectedDay) return;

        if (selectedDay.day === 1) {
            setSelectedMonth(selectedDay.minus({ days: 1 }));
        } else if (selectedDay.month !== selectedMonth.month) {
            setSelectedMonth(selectedDay);
        }

        setSelectedDay(selectedDay.minus({ days: 1 }));
    }, [selectedDay, selectedMonth]);

    const handleDayClick = useCallback(
        (date: DateTime) => {
            setSelectedDay(date);
            setSelectedMonth(date);

            if (!displayDayView) {
                setDisplayDayView(true);
            }
        },
        [displayDayView]
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

    const handleToday = useCallback(() => {
        setSelectedDay(DateTime.now());
        setSelectedMonth(DateTime.now());
    }, []);

    const closeDrawer = useCallback(() => {
        setDisplayDayView(false);
        nullifyDayTimeout.current = setTimeout(() => {
            setSelectedDay(null);
        }, 500);
    }, []);

    useEffect(() => {
        if (selectedDay && nullifyDayTimeout.current) {
            clearTimeout(nullifyDayTimeout.current);
        }
    }, [selectedDay, nullifyDayTimeout]);

    useEffect(() => {
        if (viewport.isLargerThan('medium')) {
            if (!selectedDay) {
                setSelectedDay(DateTime.local());
            }

            if (!displayDayView) {
                setDisplayDayView(true);
            }
        }
    }, [displayDayView, selectedDay, viewport]);

    const checkDayDrawerVisibility = useCallback(() => {
        if (viewport.isSmallerThan('large')) {
            if (displayDayView) {
                setDisplayDayView(false);
                setSelectedDay(null);
            }
        }
    }, [displayDayView, viewport]);

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
                    <Day data={selectedDay ? data[selectedDay.toFormat('yyyy-MM-dd')] ?? [] : []} date={selectedDay} />
                </div>
            </DrawerWrapper>
            <div className={formatClasses(styles, ['column', 'right'])}>
                <Month
                    data={data}
                    currentDay={selectedDay}
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
