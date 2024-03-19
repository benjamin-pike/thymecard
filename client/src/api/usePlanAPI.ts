import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendRequest } from '@/lib/api/sendRequest';
import { ROUTES } from './routes';
import {
    Client,
    EEventBookmarkType,
    IActivityEventBookmark,
    IDay,
    IDayEventCreate,
    IDayEventItemUpdate,
    IDayEventUpdate,
    IMealEventBookmark,
    IPagedResponse
} from '@thymecard/types';

export const usePlanAPI = () => {
    const { mutateAsync: callGetDays } = useMutation(
        async ({ startDate, limit, nextKey }: { startDate?: string; limit?: number; nextKey?: string }) => {
            const { status, data } = await sendRequest(ROUTES.DAYS.GET_DAYS, 'GET', {
                query: {
                    startDate: startDate,
                    limit,
                    nextKey
                }
            });

            if (status !== 200) {
                throw new Error('Failed to fetch the plan');
            }

            return data;
        }
    );

    const getDays = useCallback(
        async (startDate: string, limit: number, nextKey?: string) => {
            const fetchedDays = await callGetDays({ startDate, limit, nextKey });

            return fetchedDays;
        },
        [callGetDays]
    );

    const { mutateAsync: callCopyEvents } = useMutation(
        async ({ originDate, targetDate, excludedEvents }: { originDate: string; targetDate: string; excludedEvents: string[] }) => {
            const { data, status } = await sendRequest<{ day: IDay }>(ROUTES.DAYS.COPY_EVENTS, 'POST', {
                params: {
                    date: originDate
                },
                body: {
                    targetDate,
                    excludedEvents
                }
            });

            if (status !== 201) {
                throw new Error('Failed to copy events');
            }

            return data;
        }
    );

    const copyEvents = useCallback(
        async (originDate: string, targetDate: string, excludedEvents: string[]) => {
            const { day } = await callCopyEvents({ originDate, targetDate, excludedEvents });

            return day;
        },
        [callCopyEvents]
    );

    const { mutateAsync: callClearEvents } = useMutation(async ({ date, excludedEvents }: { date: string; excludedEvents: string[] }) => {
        const { data, status } = await sendRequest<{ day: IDay }>(ROUTES.DAYS.CLEAR_EVENTS, 'POST', {
            params: {
                date
            },
            body: {
                excludedEvents
            }
        });

        if (status !== 200) {
            throw new Error('Failed to clear events');
        }

        return data;
    });

    const clearEvents = useCallback(
        async (date: string, excludedEvents: string[]) => {
            const { day } = await callClearEvents({ date, excludedEvents });

            return day;
        },
        [callClearEvents]
    );

    const { mutateAsync: callCreateEvent } = useMutation(async ({ date, event }: { date: string; event: Client<IDayEventCreate> }) => {
        const { status, data } = await sendRequest(ROUTES.DAYS.CREATE_EVENT, 'POST', {
            params: {
                date: date
            },
            body: event
        });

        if (status !== 201) {
            throw new Error('Failed to create the event');
        }

        return data;
    });

    const createEvent = useCallback(
        async (date: string, event: Client<IDayEventCreate>): Promise<Client<IDay>> => {
            const { day } = await callCreateEvent({ date, event });

            return day;
        },
        [callCreateEvent]
    );

    const { mutateAsync: callUpdateEvent } = useMutation(
        async ({ date, eventId, update }: { date: string; eventId: string; update: Client<IDayEventUpdate> }) => {
            const { status, data } = await sendRequest<{ day: IDay }>(ROUTES.DAYS.UPDATE_EVENT, 'PUT', {
                params: {
                    date,
                    eventId
                },
                body: update
            });

            if (status !== 200) {
                throw new Error('Failed to update the event');
            }

            return data;
        }
    );

    const updateEvent = useCallback(
        async (date: string, eventId: string, update: Client<IDayEventUpdate>): Promise<Client<IDay>> => {
            const { day } = await callUpdateEvent({ date, eventId, update });

            return day;
        },
        [callUpdateEvent]
    );

    const { mutateAsync: callDeleteEvent } = useMutation(async ({ date, eventId }: { date: string; eventId: string }) => {
        const { status } = await sendRequest(ROUTES.DAYS.DELETE_EVENT, 'DELETE', {
            params: {
                date: date,
                eventId
            }
        });

        if (status !== 204) {
            throw new Error('Failed to delete the event');
        }
    });

    const deleteEvent = useCallback(
        async (date: string, eventId: string) => {
            await callDeleteEvent({ date, eventId });
        },
        [callDeleteEvent]
    );

    const { mutateAsync: callDeleteEventItem } = useMutation(
        async ({ date, eventId, itemId }: { date: string; eventId: string; itemId: string }) => {
            const { status } = await sendRequest(ROUTES.DAYS.DELETE_EVENT_ITEM, 'DELETE', {
                params: {
                    date,
                    eventId,
                    itemId
                }
            });

            if (status !== 204) {
                throw new Error('Failed to delete the event item');
            }
        }
    );

    const deleteEventItem = useCallback(
        async (date: string, eventId: string, itemId: string) => {
            await callDeleteEventItem({ date, eventId, itemId });
        },
        [callDeleteEventItem]
    );

    const { mutateAsync: callUpdateEventItem } = useMutation(
        async ({ date, eventId, itemId, update }: { date: string; eventId: string; itemId: string; update: IDayEventItemUpdate }) => {
            const { status, data } = await sendRequest<{ day: IDay }>(ROUTES.DAYS.UPDATE_EVENT_ITEM, 'PUT', {
                params: {
                    date,
                    eventId,
                    itemId
                },
                body: update
            });

            if (status !== 200) {
                throw new Error('Failed to update the event item');
            }

            return data;
        }
    );

    const updateEventItem = useCallback(
        async (date: string, eventId: string, itemId: string, update: IDayEventItemUpdate) => {
            const { day } = await callUpdateEventItem({ date, eventId, itemId, update });

            return day;
        },
        [callUpdateEventItem]
    );

    const { mutateAsync: callCreateEventBookmark } = useMutation(
        async ({
            bookmarkType,
            eventDate,
            eventId,
            bookmarkName,
            includeType,
            includeTime,
            includeDuration,
            excludedItems
        }: {
            bookmarkType: EEventBookmarkType;
            eventDate: string;
            eventId: string;
            bookmarkName: string;
            includeType: boolean;
            includeTime: boolean;
            includeDuration: boolean;
            excludedItems: string[];
        }) => {
            const { status, data } = await sendRequest<{ day: IDay }>(ROUTES.DAYS.CREATE_EVENT_BOOKMARK, 'POST', {
                query: {
                    bookmarkType
                },
                body: {
                    eventDate,
                    eventId,
                    bookmarkName,
                    includeType,
                    includeTime,
                    includeDuration,
                    excludedItems
                }
            });

            if (status !== 201) {
                throw new Error('Failed to bookmark the event');
            }

            return data;
        }
    );

    const createEventBookmark = useCallback(
        async (
            bookmarkType: EEventBookmarkType,
            eventDate: string,
            eventId: string,
            bookmarkName: string,
            includeType: boolean,
            includeTime: boolean,
            includeDuration: boolean,
            excludedItems: string[]
        ) => {
            const { day } = await callCreateEventBookmark({
                bookmarkType,
                eventDate,
                eventId,
                bookmarkName,
                includeType,
                includeTime,
                includeDuration,
                excludedItems
            });

            return day;
        },
        [callCreateEventBookmark]
    );

    const { mutateAsync: callGetMealEventBookmarks } = useMutation(async ({ nextKey }: { nextKey?: string }) => {
        const { status, data } = await sendRequest<IPagedResponse<IMealEventBookmark>>(ROUTES.DAYS.GET_EVENT_BOOKMARKS, 'GET', {
            query: {
                bookmarkType: EEventBookmarkType.MEAL,
                nextKey
            }
        });

        if (status !== 200) {
            throw new Error('Failed to fetch event bookmarks');
        }

        return data;
    });

    const getMealEventBookmarks = useCallback(
        async (nextKey?: string) => {
            const { data, page } = await callGetMealEventBookmarks({ nextKey });
            const { nextKey: next } = page;

            return {
                data,
                nextKey: next
            };
        },
        [callGetMealEventBookmarks]
    );

    const { mutateAsync: callSearchMealEventBookmarks } = useMutation(async ({ query }: { query: string }) => {
        const { status, data } = await sendRequest<IPagedResponse<IMealEventBookmark>>(ROUTES.DAYS.SEARCH_EVENT_BOOMARKS, 'GET', {
            query: {
                query: encodeURIComponent(query),
                bookmarkType: EEventBookmarkType.MEAL
            }
        });

        if (status !== 200) {
            throw new Error('Failed to search event bookmarks');
        }

        return data;
    });

    const searchMealEventBookmarks = useCallback(
        async (query: string) => {
            const { data, page } = await callSearchMealEventBookmarks({ query });
            const { nextKey } = page;

            return {
                data,
                nextKey
            };
        },
        [callSearchMealEventBookmarks]
    );

    const { mutateAsync: callSearchActivityEventBookmarks } = useMutation(async ({ query }: { query: string }) => {
        const { status, data } = await sendRequest<IPagedResponse<IActivityEventBookmark>>(ROUTES.DAYS.SEARCH_EVENT_BOOMARKS, 'GET', {
            params: {
                bookmarkType: EEventBookmarkType.ACTIVITY
            },
            query: {
                query: encodeURIComponent(query)
            }
        });

        if (status !== 200) {
            throw new Error('Failed to search event bookmarks');
        }

        return data;
    });

    const searchActivityEventBookmarks = useCallback(
        async (query: string) => {
            const { data, page } = await callSearchActivityEventBookmarks({ query });
            const { nextKey } = page;

            return {
                data,
                nextKey
            };
        },
        [callSearchActivityEventBookmarks]
    );

    return {
        getDays,
        copyEvents,
        clearEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        updateEventItem,
        deleteEventItem,
        createEventBookmark,
        getMealEventBookmarks,
        searchMealEventBookmarks,
        searchActivityEventBookmarks
    };
};
