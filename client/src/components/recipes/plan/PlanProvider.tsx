import { createContext, useContext, FC, ReactElement, useCallback, useState, useMemo } from 'react';
import { DateTime } from 'luxon';

import { usePlanAPI } from '@/api/usePlanAPI';
import { useMount } from '@/hooks/common/useMount';

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
    selectedDay: ISelectedDay;
    selectedEvent: IDayEvent | undefined;
    init: (days: Client<IDay[]>) => void;
    handleSelectDay: (dayIndex: number) => () => void;
    handleCopyDay: (targetDate: DateTime, excludedEvents: string[]) => Promise<void>;
    handleClearDay: () => Promise<void>;
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
    date: string;
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
    const { getDays, copyDay, deleteDay, createEvent, updateEvent, deleteEvent, createEventBookmark, updateEventItem, deleteEventItem } =
        usePlanAPI();

    const [plan, setPlan] = useState<Plan>([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedDay: ISelectedDay = useMemo(
        () => ({
            index: selectedDayIndex,
            date: TODAY.plus({ days: selectedDayIndex }).toISODate(),
            events: (!!plan && plan[selectedDayIndex]?.events) || []
        }),
        [plan, selectedDayIndex]
    );

    const selectedEvent = useMemo(
        () => selectedDay.events.find((event) => event._id === selectedEventId),
        [selectedDay.events, selectedEventId]
    );

    const init = useCallback((days: Client<IDay[]>) => {
        setPlan(spreadDays(days, TODAY, TODAY.plus({ days: 4 })));
    }, []);

    const handleSelectDay = useCallback(
        (dayIndex: number) => () => {
            setSelectedDayIndex(dayIndex);
        },
        []
    );

    const handleCopyDay = useCallback(
        async (targetDate: DateTime, excludedEvents: string[]) => {
            const day = await copyDay(selectedDay.date, targetDate.toISODate(), excludedEvents);

            const dayIndex = DateTime.fromISO(day.date).diff(TODAY, 'days').days;

            if (dayIndex >= plan.length) {
                return;
            }

            const updatedPlan = plan.map((d, i) => (i === dayIndex ? day : d));

            setPlan(updatedPlan);
        },
        [copyDay, plan, selectedDay.date]
    );

    const handleClearDay = useCallback(async () => {
        await deleteDay(selectedDay.date);

        const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? null : d));

        setPlan(updatedPlan);
    }, [deleteDay, plan, selectedDay.date, selectedDayIndex]);

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
            await deleteEvent(selectedDay.date, eventId);

            const updatedPlan = plan.map((d, i) =>
                d && i === selectedDayIndex ? { ...d, events: d.events.filter((e) => e._id !== eventId) } : d
            );

            setPlan(updatedPlan);
        },
        [deleteEvent, plan, selectedDay.date, selectedDayIndex]
    );

    const handleSelectEvent = useCallback((eventId: string) => {
        setSelectedEventId(eventId);
        setSelectedItemId(null);
    }, []);

    const handleBookmarkEvent = useCallback(
        async (name: string, includeType: boolean, includeTime: boolean, includeDuration: boolean, excludedItems: string[]) => {
            if (!selectedEventId) {
                return;
            }

            const updatedDay = await createEventBookmark(
                EEventBookmarkType.MEAL,
                selectedDay.date,
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
        [createEventBookmark, plan, selectedDay.date, selectedDayIndex, selectedEventId]
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
            if (!selectedEventId || !selectedItemId) {
                return;
            }

            const updatedDay = await updateEventItem(selectedDay.date, selectedEventId, selectedItemId, update);

            const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? updatedDay : d));

            setPlan(updatedPlan);
        },
        [plan, selectedDay.date, selectedDayIndex, selectedEventId, selectedItemId, updateEventItem]
    );

    const handleDeleteEventItem = useCallback(
        (eventId: string) => (itemId: string) => async () => {
            if (selectedDay.events.find((e) => e._id === eventId)?.items.length === 1) {
                await deleteEvent(selectedDay.date, eventId);

                const updatedPlan = plan.map((d, i) => (i === selectedDayIndex ? null : d));

                setPlan(updatedPlan);
            }

            await deleteEventItem(selectedDay.date, eventId, itemId);

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
        [deleteEventItem, plan, selectedDay.date, selectedDayIndex]
    );

    useMount(() => {
        const fetchDays = async () => {
            const { data } = await getDays(TODAY.toISODate(), 5);

            init(data);
        };

        fetchDays();
    });

    const value = {
        plan,
        selectedDay,
        selectedEvent,
        init,
        handleSelectDay,
        handleCopyDay,
        handleClearDay,
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
