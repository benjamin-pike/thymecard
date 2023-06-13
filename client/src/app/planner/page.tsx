'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { DateTime } from 'luxon';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useWindowKeyDown } from '@/hooks/useWindowKeydown';
import { useWindowResize, IWindowDimensions } from '@/hooks/useWindowResize';
import { useMultiToggle } from '@/hooks/useMultiToggle';
import Header from '@/components/header/Header';
import ControlBar from '@/components/planner/control-bar/ControlBar';
import Day from '@/components/planner/day/Day';
import Month from '@/components/planner/month/Month';
import { isDefined } from '@/lib/type.utils';
import { formatClasses } from '@/lib/common.utils';
import { mockData } from './mockData';
import styles from './planner.module.css';

const Planner = () => {
    const [selectedDay, setSelectedDay] = useState<DateTime | null>(DateTime.local());
    const [selectedMonth, setSelectedMonth] = useState<DateTime>(DateTime.local());

    const [displayMeals, setDisplayMeals] = useState<boolean>(true);
    const [displayActivities, setDisplayActivities] = useState<boolean>(true);
    const [displayTime, setDisplayTime] = useState<boolean>(true);

    const [eventDisplayFormat, toggleEventDisplayFormat] = useMultiToggle(['compact', 'detailed', 'expanded'] as const, 1);

    const [displayDayOverlay, setDisplayDayOverlay] = useState(false);
    const [displayControlBar, setDisplayControlBar] = useState(true);

    const leftColumnRef = useRef<HTMLDivElement>(null);

    const handleMonthBackward = useCallback(() => {
        setSelectedMonth(selectedMonth.minus({ months: 1 }));
    }, [selectedMonth]);

    const handleMonthForward = useCallback(() => {
        setSelectedMonth(selectedMonth.plus({ months: 1 }));
    }, [selectedMonth]);

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
    }, []);

    const handleTime = useCallback(() => {
        setDisplayTime(!displayTime);
    }, [displayTime]);

    const handleToday = useCallback(() => {
        setSelectedDay(DateTime.now());
        setSelectedMonth(DateTime.now());
    }, []);

    const closeOverlay = useCallback(() => {
        setDisplayDayOverlay(false);
        setTimeout(() => {
            setSelectedDay(null);
        }, 500);
    }, []);

    const handleBackdropClick = useCallback(() => {
        if (selectedDay && window.innerWidth <= 1024) {
            closeOverlay();
        }
    }, [selectedDay]);

    const checkControlBarVisibility = useCallback(
        ({ width }: IWindowDimensions) => {
            if (width <= 600 || selectedDay) {
                setDisplayControlBar(true);
            } else {
                setDisplayControlBar(false);
            }
        },
        [selectedDay]
    );

    const checkDayOverlayVisibility = useCallback(
        ({ width }: IWindowDimensions) => {
            if (width > 1024) {
                if (selectedDay === null) {
                    setDisplayDayOverlay(false);
                    setSelectedDay(DateTime.local());
                    setDisplayControlBar(true);
                }
            } else {
                setSelectedDay(null);
                setDisplayDayOverlay(false);
            }
        },
        [selectedDay]
    );

    const preventControlBarTransition = useCallback(() => {
        leftColumnRef.current?.classList.add(styles.preventTransition);
        setTimeout(() => {
            leftColumnRef.current?.classList.remove(styles.preventTransition);
        }, 0);
    }, []);

    useClickOutside(leftColumnRef, handleBackdropClick);

    useWindowKeyDown('ArrowLeft', handleMonthBackward);
    useWindowKeyDown('ArrowRight', handleMonthForward);
    useWindowKeyDown('Escape', () => {
        if (window.innerWidth <= 1024) {
            closeOverlay();
        }
    });

    useWindowResize(checkControlBarVisibility);
    useWindowResize(checkDayOverlayVisibility);
    useWindowResize(preventControlBarTransition);

    useEffect(() => {
        if (!isDefined(window)) {
            return;
        }

        if (selectedDay && window.innerWidth <= 1024) {
            setDisplayDayOverlay(true);
        }
    }, [selectedDay]);

    return (
        <>
            <Header page="planner" />
            <main className={formatClasses(styles, ['content', displayDayOverlay ? 'dayOverlay' : ''])}>
                <div ref={leftColumnRef} className={formatClasses(styles, ['column', 'left'])}>
                    <ControlBar
                        displayControlBar={displayControlBar}
                        currentDay={selectedDay}
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
                    <Day
                        data={selectedDay ? mockData[selectedDay.toFormat('yyyy-MM-dd')] ?? [] : []}
                        date={selectedDay}
                        closeOverlay={closeOverlay}
                    />
                </div>
                <div className={formatClasses(styles, ['column', 'right'])}>
                    <Month
                        data={mockData}
                        currentDay={selectedDay}
                        currentMonth={selectedMonth}
                        displayActivities={displayActivities}
                        displayMeals={displayMeals}
                        displayTime={displayTime}
                        eventDisplayFormat={eventDisplayFormat}
                        handleDayClick={setSelectedDay}
                    />
                </div>
            </main>
        </>
    );
};

export default Planner;
