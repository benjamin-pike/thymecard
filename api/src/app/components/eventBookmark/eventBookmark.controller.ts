import { NotFoundError, UnprocessableError } from '../../lib/error/thymecardError';
import { isNonEmptyString } from '../../lib/types/typeguards.utils';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IPagedResult } from '../../lib/types/common.types';
import {
    EEventBookmarkType,
    ErrorCode,
    IActivityEventBookmark,
    IDay,
    IMealEventBookmark,
    isActivityEvent,
    isEventBookmarkType,
    isMealEvent,
    isOptionalString
} from '@thymecard/types';
import { IEventBookmarkService } from './eventBookmark.service';
import { IDayService } from '../day/day.service';
import { isDayEventBookmarkRequestBody } from './eventBookmark.types';

interface IEventBookmarkControllerDependencies {
    eventBookmarkService: IEventBookmarkService;
    dayService: IDayService;
}

export interface IEventBookmarkController {
    create(context: IAuthenticatedContext, bookmarkType: unknown, reqBody: unknown): Promise<IDay>;
    get(context: IAuthenticatedContext, bookmarkType: unknown, nextKey?: unknown): Promise<IPagedResult<IMealEventBookmark | IActivityEventBookmark>>;
    search(
        context: IAuthenticatedContext,
        bookmarkType: unknown,
        query: unknown
    ): Promise<IPagedResult<IMealEventBookmark | IActivityEventBookmark>>;
}

export class EventBookmarkController implements IEventBookmarkController {
    private eventBookmarkService: IEventBookmarkService;
    private dayService: IDayService;

    constructor(deps: IEventBookmarkControllerDependencies) {
        this.eventBookmarkService = deps.eventBookmarkService;
        this.dayService = deps.dayService;
    }

    public async create(context: IAuthenticatedContext, bookmarkType: unknown, reqBody: unknown): Promise<IDay> {
        if (!isEventBookmarkType(bookmarkType)) {
            throw new UnprocessableError(ErrorCode.InvalidEventBookmarkType, 'Invalid event bookmark type', {
                origin: 'EventBookmarkController.bookmarkEvent',
                data: { bookmarkType }
            });
        }

        if (!isDayEventBookmarkRequestBody(reqBody)) {
            throw new UnprocessableError(ErrorCode.InvalidEventBookmarkRequestBody, 'Invalid request body', {
                origin: 'EventBookmarkController.bookmarkEvent',
                data: { reqBody }
            });
        }

        const { userId } = context;
        const { eventDate, eventId, bookmarkName, includeType, includeTime, includeDuration, excludedItems } = reqBody;

        const day = await this.dayService.getDay(eventDate, userId);

        const event = day.events.find((event) => event._id === eventId);

        if (!event) {
            throw new NotFoundError(ErrorCode.DayEventNotFound, 'Event not found', {
                origin: 'EventBookmarkService.bookmarkEvent',
                data: { date: eventDate, userId: userId, eventId }
            });
        }

        switch (bookmarkType) {
            case EEventBookmarkType.MEAL:
                if (!isMealEvent(event)) {
                    throw new UnprocessableError(ErrorCode.InvalidEventBookmarkType, 'Invalid event type', {
                        origin: 'EventBookmarkController.bookmarkEvent',
                        data: { event }
                    });
                }

                const mealBookmark = await this.eventBookmarkService.createMealEventBookmark(
                    userId,
                    bookmarkName,
                    includeType,
                    includeTime,
                    includeDuration,
                    excludedItems,
                    event
                );

                return await this.dayService.updateEvent(eventDate, userId, eventId, {
                    bookmarkId: mealBookmark._id
                });

            case EEventBookmarkType.ACTIVITY:
                if (!isActivityEvent(event)) {
                    throw new UnprocessableError(ErrorCode.InvalidEventBookmarkType, 'Invalid event type', {
                        origin: 'EventBookmarkController.bookmarkEvent',
                        data: { event }
                    });
                }

                const activityBookmark = await this.eventBookmarkService.createActivityEventBookmark(
                    userId,
                    bookmarkName,
                    includeType,
                    includeTime,
                    includeDuration,
                    excludedItems,
                    event
                );

                return await this.dayService.updateEvent(eventDate, userId, eventId, {
                    bookmarkId: activityBookmark._id
                });
        }
    }

    public async get(context: IAuthenticatedContext, bookmarkType: unknown, nextKey: unknown): Promise<IPagedResult<IMealEventBookmark | IActivityEventBookmark>> {
        if (!isEventBookmarkType(bookmarkType)) {
            throw new UnprocessableError(ErrorCode.InvalidEventBookmarkType, 'Invalid event bookmark type', {
                origin: 'EventBookmarkController.getEventBookmarks',
                data: { bookmarkType }
            });
        }

        if (!isOptionalString(nextKey)) {
            throw new UnprocessableError(ErrorCode.InvalidNextKey, 'Invalid next key', {
                origin: 'EventBookmarkController.getEventBookmarks',
                data: { nextKey }
            });
        }

        switch (bookmarkType) {
            case EEventBookmarkType.MEAL:
                return this.eventBookmarkService.getMealEventBookmarks(context.userId, nextKey);
            case EEventBookmarkType.ACTIVITY:
                return this.eventBookmarkService.getActivityEventBookmarks(context.userId, nextKey);
        }
    }

    public async search(
        context: IAuthenticatedContext,
        bookmarkType: unknown,
        query: unknown
    ): Promise<IPagedResult<IMealEventBookmark | IActivityEventBookmark>> {
        if (!isEventBookmarkType(bookmarkType)) {
            throw new UnprocessableError(ErrorCode.InvalidEventBookmarkType, 'Invalid event bookmark type', {
                origin: 'EventBookmarkController.searchEventBookmarks',
                data: { bookmarkType }
            });
        }

        if (!isNonEmptyString(query)) {
            throw new UnprocessableError(ErrorCode.InvalidSearchQuery, 'Invalid query string', {
                origin: 'EventBookmarkController.searchEventBookmarks',
                data: { query }
            });
        }

        switch (bookmarkType) {
            case EEventBookmarkType.MEAL:
                return this.eventBookmarkService.searchMealEventBookmarks(context.userId, query);
            case EEventBookmarkType.ACTIVITY:
                return this.eventBookmarkService.searchActivityEventBookmarks(context.userId, query);
        }
    }
}
