import { createContext, useContext, FC, ReactElement, useCallback, useState, useMemo } from 'react';
import { DateTime } from 'luxon';

import { usePlanAPI } from '@/api/usePlanAPI';

import {
    Client,
    EEventBookmarkType,
    EEventType,
    IDay,
    IDayEvent,
    IDayEventUpdate,
    IMealEventItem,
    IMealEventItemUpdate,
    ITime
} from '@thymecard/types';

type Plan = (Client<IDay> | null)[];

interface IPlanContext {
    plan: Plan;
    isLoading: boolean;
    selectedDay: ISelectedDay;
    selectedMonth: DateTime;
    selectedEvent: IDayEvent | undefined;
    startDate: DateTime;
    endDate: DateTime;
    handleFetchDays: (startDate: DateTime, count: number) => Promise<void>;
    handleSelectDay: (date: DateTime) => void;
    handleDeselectDay: () => Promise<void>;
    handleMonthBackward: () => void;
    handleMonthForward: () => void;
    handleDayForward: () => void;
    handleDayBackward: () => void;
    handleToday: () => void;
    handleCopyEvents: (targetDate: DateTime, excludedEvents: string[]) => Promise<void>;
    handleClearEvents: (excludedEvents: string[]) => Promise<void>;
    handleSelectEvent: (eventId: string) => void;
    handleCreateEvent: (resource: IEventCreateResource) => Promise<void>;
    handleUpdateEvent: (date: string, eventId: string, update: Client<IDayEventUpdate>) => Promise<void>;
    handleDeleteEvent: (eventId: string) => () => void;
    handleBookmarkEvent: (
        name: string,
        includeType: boolean,
        includeTime: boolean,
        includeDuration: boolean,
        excludedItems: string[]
    ) => Promise<void>;
    handleSelectEventItem: (eventId: string) => (itemId: string) => () => void;
    handleUpdateMealEventItem: (update: IMealEventItemUpdate) => void;
    handleDeleteEventItem: (eventId: string) => (itemId: string) => () => void;
}

interface ISelectedDay {
    index: number;
    date: DateTime | null;
    events: IDayEvent[];
}

interface IEventCreateResource {
    date: DateTime;
    type: EEventType;
    time: ITime;
    duration: ITime;
    items: IMealEventItem[];
}

const PlanContext = createContext<IPlanContext | null>(null);
const { Provider } = PlanContext;

export const usePlan = () => {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error('usePlan must be used within a PlanProvider');
    }
    return context;
};

interface IPlanProviderProps {
    children: ReactElement;
}

const TODAY = DateTime.now().startOf('day');

const PlanProvider: FC<IPlanProviderProps> = ({ children }) => {
    const {
        getDays,
        copyEvents,
        clearEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        createEventBookmark,
        updateEventItem,
        deleteEventItem
    } = usePlanAPI();

    const [plan, setPlan] = useState<Plan>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [startDate, setStartDate] = useState<DateTime>(TODAY);
    const endDate = useMemo(() => (plan.length > 0 ? startDate.plus({ days: plan.length - 1 }) : TODAY), [plan, startDate]);

    const [selectedMonth, setSelectedMonth] = useState<DateTime>(TODAY);
    const [selectedDate, setSelectedDate] = useState<DateTime | null>(TODAY);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedDayIndex = useMemo(() => (selectedDate ? selectedDate.diff(startDate, 'days').days : -1), [selectedDate, startDate]);

    const selectedDay: ISelectedDay = useMemo(
        () => ({
            index: selectedDayIndex,
            date: selectedDate,
            events: (!!plan && plan[selectedDayIndex]?.events) || []
        }),
        [plan, selectedDate, selectedDayIndex]
    );

    const selectedEvent = useMemo(() => {
        if (!selectedDay || !selectedEventId) {
            return;
        }

        return selectedDay.events.find((event) => event._id === selectedEventId);
    }, [selectedDay, selectedEventId]);

    const initPlan = useCallback((days: Client<IDay[]>, start: DateTime, count: number) => {
        setPlan(spreadDays(days, start, start.plus({ days: count - 1 })));
        setStartDate(start);
    }, []);

    const mergePlan = useCallback(
        (newDays: Client<IDay[]>, existingPlan: (Client<IDay> | null)[], newStartDate: DateTime, count: number) => {
            const existingEndDate = startDate.plus({ days: existingPlan.length - 1 });
            const newEndDate = newStartDate.plus({ days: count - 1 });

            const overallStartDate = startDate < newStartDate ? startDate : newStartDate;
            const overallEndDate = existingEndDate > newEndDate ? existingEndDate : newEndDate;

            const range = overallEndDate.diff(overallStartDate, 'days').days;

            const existingDaysObj = existingPlan.reduce<Record<string, Client<IDay>>>((acc, day) => {
                if (day !== null) {
                    acc[day.date] = day;
                }

                return acc;
            }, {});

            const newDaysObj = newDays.reduce<Record<string, Client<IDay>>>((acc, day) => {
                acc[DateTime.fromISO(day.date).toISODate()] = day;

                return acc;
            }, {});

            const combinedPlan = Array.from({ length: range }, (_, index) => {
                const date = overallStartDate.plus({ days: index }).toISODate();
                return existingDaysObj[date] || newDaysObj[date] || null;
            });

            setPlan(combinedPlan);

            if (overallStartDate < startDate) {
                setStartDate(overallStartDate);
            }
        },
        [startDate, setPlan, setStartDate]
    );

    const handleFetchDays = useCallback(
        async (start: DateTime, count: number) => {
            if (isLoading) {
                return;
            }

            setIsLoading(true);

            const { data } = await getDays(start.toISODate(), count);

            if (plan.length === 0) {
                initPlan(data, start, count);
            } else {
                mergePlan(data, plan, start, count);
            }

            setIsLoading(false);
        },
        [getDays, initPlan, isLoading, mergePlan, plan]
    );

    const handleSelectDay = useCallback(
        (date: DateTime) => {
            if (date.month !== selectedMonth.month) {
                setSelectedMonth(date);
            }

            setSelectedDate(date);
        },
        [selectedMonth.month]
    );

    const handleDeselectDay = useCallback(async () => {
        setSelectedDate(null);
    }, []);

    const handleMonthBackward = useCallback(() => {
        setSelectedMonth(selectedMonth.minus({ months: 1 }));
    }, [selectedMonth]);

    const handleMonthForward = useCallback(() => {
        setSelectedMonth(selectedMonth.plus({ months: 1 }));
    }, [selectedMonth]);

    const handleDayForward = useCallback(() => {
        if (!selectedDay.date) return;

        const newDate = selectedDay.date?.plus({ days: 1 });

        if (newDate?.month !== selectedDay.date?.month) {
            setSelectedMonth(newDate);
        }

        handleSelectDay(newDate);
    }, [handleSelectDay, selectedDay]);

    const handleDayBackward = useCallback(() => {
        if (!selectedDay || !selectedDay.date) return;

        const newDate = selectedDay.date?.minus({ days: 1 });

        if (newDate?.month !== selectedDay.date?.month) {
            setSelectedMonth(newDate);
        }

        handleSelectDay(newDate);
    }, [handleSelectDay, selectedDay]);

    const handleToday = useCallback(() => {
        handleSelectDay(TODAY);
        setSelectedMonth(TODAY);
    }, [handleSelectDay]);

    const handleCopyEvents = useCallback(
        async (targetDate: DateTime, excludedEvents: string[]) => {
            if (!selectedDay.date) {
                return;
            }

            const day = await copyEvents(selectedDay.date.toISODate(), targetDate.toISODate(), excludedEvents);

            const dayIndex = DateTime.fromISO(day.date).diff(startDate, 'days').days;

            if (dayIndex >= plan.length) {
                return;
            }

            const updatedPlan = plan.map((d, i) => (i === dayIndex ? day : d));

            setPlan(updatedPlan);
        },
        [selectedDay.date, copyEvents, startDate, plan]
    );

    const handleClearEvents = useCallback(
        async (excludedEvents: string[]) => {
            if (!selectedDay.date) {
                return;
            }

            const day = await clearEvents(selectedDay.date.toISODate(), excludedEvents);

            const dayIndex = DateTime.fromISO(day.date).diff(startDate, 'days').days;

            if (dayIndex >= plan.length) {
                return;
            }

            const updatedPlan = plan.map((d, i) => (i === dayIndex ? day : d));

            setPlan(updatedPlan);
        },
        [selectedDay.date, clearEvents, plan]
    );

    const handleCreateEvent = useCallback(
        async ({ date, type, time, duration, items }: IEventCreateResource) => {
            const timeM = time.hours * 60 + time.minutes;
            const durationM = duration.hours * 60 + duration.minutes;

            const updatedDay = await createEvent(date.toISODate(), {
                type: type,
                time: timeM,
                duration: durationM,
                items
            });

            const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? updatedDay : d));

            setPlan(updatedPlan);
        },
        [createEvent, plan, selectedDayIndex]
    );

    const handleUpdateEvent = useCallback(
        async (date: string, eventId: string, update: Client<IDayEventUpdate>) => {
            const updatedDay = await updateEvent(date, eventId, update);

            const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? updatedDay : d));

            setPlan(updatedPlan);
        },
        [plan, selectedDayIndex, updateEvent]
    );

    const handleDeleteEvent = useCallback(
        (eventId: string) => async () => {
            if (!selectedDay.date) {
                return;
            }

            await deleteEvent(selectedDay.date.toISODate(), eventId);

            const updatedPlan = plan.map((d, i) =>
                d && i === selectedDayIndex ? { ...d, events: d.events.filter((e) => e._id !== eventId) } : d
            );

            setPlan(updatedPlan);
        },
        [deleteEvent, plan, selectedDay, selectedDayIndex]
    );

    const handleSelectEvent = useCallback((eventId: string) => {
        setSelectedEventId(eventId);
        setSelectedItemId(null);
    }, []);

    const handleBookmarkEvent = useCallback(
        async (name: string, includeType: boolean, includeTime: boolean, includeDuration: boolean, excludedItems: string[]) => {
            if (!selectedEventId || !selectedDay.date) {
                return;
            }

            const updatedDay = await createEventBookmark(
                EEventBookmarkType.MEAL,
                selectedDay.date.toISODate(),
                selectedEventId,
                name,
                includeType,
                includeTime,
                includeDuration,
                excludedItems
            );

            const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? updatedDay : d));

            setPlan(updatedPlan);
        },
        [createEventBookmark, plan, selectedDay, selectedDayIndex, selectedEventId]
    );

    const handleSelectEventItem = useCallback(
        (eventId: string) => (itemId: string) => () => {
            setSelectedEventId(eventId);
            setSelectedItemId(itemId);
        },
        []
    );

    const handleUpdateMealEventItem = useCallback(
        async (update: IMealEventItemUpdate) => {
            if (!selectedEventId || !selectedItemId || !selectedDay.date) {
                return;
            }

            const updatedDay = await updateEventItem(selectedDay.date.toISODate(), selectedEventId, selectedItemId, update);

            const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? updatedDay : d));

            setPlan(updatedPlan);
        },
        [plan, selectedDay, selectedDayIndex, selectedEventId, selectedItemId, updateEventItem]
    );

    const handleDeleteEventItem = useCallback(
        (eventId: string) => (itemId: string) => async () => {
            if (!selectedDay.date) {
                return;
            }

            if (selectedDay.events.find((e) => e._id === eventId)?.items.length === 1) {
                await deleteEvent(selectedDay.date.toISODate(), eventId);

                const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? null : d));

                setPlan(updatedPlan);
            }

            await deleteEventItem(selectedDay.date.toISODate(), eventId, itemId);

            const updatedPlan = plan.map((day, index) => {
                if (day && index === selectedDayIndex) {
                    return {
                        ...day,
                        events: day.events.map((event) => {
                            if (event._id === eventId) {
                                return {
                                    ...event,
                                    items: event.items.filter((item) => item.id !== itemId)
                                };
                            } else {
                                return event;
                            }
                        })
                    };
                } else {
                    return day;
                }
            });

            setPlan(updatedPlan);
        },
        [deleteEvent, deleteEventItem, plan, selectedDay, selectedDayIndex]
    );

    const value = {
        plan,
        isLoading,
        startDate,
        endDate,
        selectedDay,
        selectedMonth,
        selectedEvent,
        handleFetchDays,
        handleSelectDay,
        handleCopyEvents,
        handleClearEvents,
        handleDeselectDay,
        handleMonthBackward,
        handleMonthForward,
        handleDayForward,
        handleDayBackward,
        handleToday,
        handleSelectEvent,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleBookmarkEvent,
        handleSelectEventItem,
        handleUpdateMealEventItem,
        handleDeleteEventItem
    };

    return <Provider value={value}>{children}</Provider>;
};

export default PlanProvider;

const spreadDays = (days: Client<IDay[]>, startDate: DateTime, endDate: DateTime): (Client<IDay> | null)[] => {
    const count = endDate.diff(startDate, 'days').days + 1;

    return Array.from({ length: count }, (_, i) => {
        const date = startDate.plus({ days: i }).toISODate();
        const day = days.find((day) => date === DateTime.fromISO(day.date).toISODate());

        return day ? { ...day, date } : null;
    });
};
