import { ZodError } from 'zod';
import { UnprocessableError } from '../../lib/error/thymecardError';
import { hasKey, isDefined, isNonEmptyString, isNumberString, isPlainObject, isISODateString } from '../../lib/types/typeguards.utils';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IDayService } from './day.service';
import { createDaySchema, createEventSchema, updateDaySchema, updateEventItemSchema, updateEventSchema } from './day.types';
import { formatZodError } from '../../lib/error/error.utils';
import { IPagedResult } from '../../lib/types/common.types';
import {
    ErrorCode,
    IDay,
    IDayCreate,
    IDayEventCreate,
    IDayEventItemUpdate,
    IDayEventUpdate,
    IDayUpdate,
    isArrayOf,
    isUuid,
    isValidMongoId
} from '@thymecard/types';

interface IDayControllerDependencies {
    dayService: IDayService;
}

export interface IDayController {
    createDay(context: IAuthenticatedContext, resource: unknown): Promise<IDay>;
    updateDay(context: IAuthenticatedContext, date: unknown, resource: unknown): Promise<IDay>;
    getDays(context: IAuthenticatedContext, startDate?: unknown, limitString?: unknown): Promise<IPagedResult<IDay>>;
    getDay(context: IAuthenticatedContext, date: unknown): Promise<IDay>;
    deleteDay(context: IAuthenticatedContext, date: unknown): Promise<void>;
    copyDay(context: IAuthenticatedContext, originDate: unknown, targetDate: unknown, excludedEvents: unknown): Promise<IDay>;
    clearDay(context: IAuthenticatedContext, date: unknown, excludedEvents: unknown): Promise<IDay>;
    createEvent(context: IAuthenticatedContext, date: unknown, resource: unknown): Promise<IDay>;
    updateEvent(context: IAuthenticatedContext, date: unknown, eventId: string, resource: unknown): Promise<IDay>;
    deleteEvent(context: IAuthenticatedContext, date: unknown, eventId: string): Promise<void>;
    updateEventItem(context: IAuthenticatedContext, date: unknown, eventId: string, itemId: string, resource: unknown): Promise<IDay>;
    deleteEventItem(context: IAuthenticatedContext, date: unknown, eventId: string, itemId: string): Promise<void>;
}

export class DayController implements IDayController {
    private dayService: IDayService;

    constructor(deps: IDayControllerDependencies) {
        this.dayService = deps.dayService;
    }

    public async createDay(context: IAuthenticatedContext, resource: unknown): Promise<IDay> {
        try {
            if (!isPlainObject(resource)) {
                throw new UnprocessableError(ErrorCode.InvalidDayCreateResource, 'Invalid day create resource', {
                    origin: 'DayController.createDay',
                    data: { resource }
                });
            }

            if (!hasKey(resource, 'date') || !isISODateString(resource.date)) {
                throw new UnprocessableError(ErrorCode.InvalidDateString, 'An invalid date string was provided', {
                    origin: 'DayController.createDay',
                    data: { resource }
                });
            }

            const date = new Date(resource.date);
            const dayResource: IDayCreate = createDaySchema.parse({ ...resource, date, userId: context.userId });

            if (dayResource.events.length === 0) {
                throw new UnprocessableError(ErrorCode.InvalidDayCreateResource, 'Please specify at least one meal', {
                    origin: 'DayController.createDay',
                    data: { resource }
                });
            }

            return this.dayService.createDay(dayResource);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidDayCreateResource, formatZodError(err), {
                    origin: 'DayController.createDay',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async updateDay(context: IAuthenticatedContext, date: unknown, resource: unknown): Promise<IDay> {
        try {
            if (!isISODateString(date)) {
                throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                    origin: 'DayController.deleteDay',
                    data: { date }
                });
            }

            if (!isPlainObject(resource)) {
                throw new UnprocessableError(ErrorCode.InvalidDayUpdateResource, 'Invalid day update resource', {
                    origin: 'DayController.updateDay',
                    data: { resource }
                });
            }

            const dayResource: IDayUpdate = updateDaySchema.parse(resource);

            return this.dayService.updateDay(date, context.userId, dayResource);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidDayUpdateResource, formatZodError(err), {
                    origin: 'DayController.updateDay',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async getDays(context: IAuthenticatedContext, startDate?: unknown, limit?: unknown): Promise<IPagedResult<IDay>> {
        if (isDefined(startDate) && !isISODateString(startDate)) {
            throw new UnprocessableError(ErrorCode.InvalidPageStartKey, 'Invalid start date', {
                origin: 'DayController.getDays',
                data: { startDate }
            });
        }

        const parsedStartDate = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
        const parsedLimit = isNumberString(limit) ? parseInt(limit) : 10;

        if (parsedLimit > 100) {
            throw new UnprocessableError(ErrorCode.InvalidPageLimit, 'Page limit may not exceed 100', {
                origin: 'DayController.getDays',
                data: { limit }
            });
        }

        return this.dayService.getDays(context.userId, parsedStartDate, parsedLimit);
    }

    public async getDay(context: IAuthenticatedContext, date: unknown): Promise<IDay> {
        if (!isISODateString(date)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                origin: 'DayController.deleteDay',
                data: { date }
            });
        }

        return this.dayService.getDay(date, context.userId);
    }

    public async deleteDay(context: IAuthenticatedContext, date: unknown): Promise<void> {
        if (!isISODateString(date)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                origin: 'DayController.deleteDay',
                data: { date }
            });
        }

        return this.dayService.deleteDay(date, context.userId);
    }

    public async copyDay(context: IAuthenticatedContext, originDate: unknown, targetDate: unknown, excludedEvents: unknown): Promise<IDay> {
        if (!isISODateString(originDate)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid origin date', {
                origin: 'DayController.deleteDay',
                data: { originDate }
            });
        }

        if (!isISODateString(targetDate)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid target date', {
                origin: 'DayController.deleteDay',
                data: { targetDate }
            });
        }

        if (!isArrayOf(excludedEvents, isValidMongoId)) {
            throw new UnprocessableError(ErrorCode.InvalidParameter, 'Invalid excluded events', {
                origin: 'DayController.deleteDay',
                data: { excludedEvents }
            });
        }

        return this.dayService.copyDay(originDate, targetDate, context.userId, excludedEvents);
    }

    public async clearDay(context: IAuthenticatedContext, date: unknown, excludedEvents: unknown): Promise<IDay> {
        if (!isISODateString(date)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                origin: 'DayController.deleteDay',
                data: { date }
            });
        }

        if (!isArrayOf(excludedEvents, isValidMongoId)) {
            throw new UnprocessableError(ErrorCode.InvalidParameter, 'Invalid excluded events', {
                origin: 'DayController.deleteDay',
                data: { excludedEvents }
            });
        }

        return this.dayService.clearDay(context.userId, date, excludedEvents);
    }

    public async createEvent(context: IAuthenticatedContext, date: unknown, resource: unknown): Promise<IDay> {
        try {
            if (!isISODateString(date)) {
                throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                    origin: 'DayController.deleteDay',
                    data: { date }
                });
            }

            const eventResource: IDayEventCreate = createEventSchema.parse(resource);

            return this.dayService.createEvent(date, context.userId, eventResource);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidMealCreateResource, formatZodError(err), {
                    origin: 'DayController.createMeal',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async updateEvent(context: IAuthenticatedContext, date: unknown, eventId: string, resource: unknown): Promise<IDay> {
        try {
            if (!isISODateString(date)) {
                throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                    origin: 'DayController.deleteDay',
                    data: { date }
                });
            }

            const eventResource: IDayEventUpdate = updateEventSchema.parse(resource);

            return this.dayService.updateEvent(date, context.userId, eventId, eventResource);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidMealUpdateResource, formatZodError(err), {
                    origin: 'DayController.updateMeal',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async deleteEvent(context: IAuthenticatedContext, date: unknown, eventId: unknown): Promise<void> {
        if (!isISODateString(date)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                origin: 'DayController.deleteDay',
                data: { date }
            });
        }

        if (!isNonEmptyString(eventId)) {
            throw new UnprocessableError(ErrorCode.InvalidEventId, 'Invalid event ID', {
                origin: 'DayController.deleteEvent',
                data: { eventId }
            });
        }

        return this.dayService.deleteEvent(date, context.userId, eventId);
    }

    public async updateEventItem(
        context: IAuthenticatedContext,
        date: unknown,
        eventId: unknown,
        itemId: unknown,
        resource: unknown
    ): Promise<IDay> {
        if (!isISODateString(date)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                origin: 'DayController.deleteDay',
                data: { date }
            });
        }

        if (!isValidMongoId(eventId)) {
            throw new UnprocessableError(ErrorCode.InvalidEventId, 'Invalid event ID', {
                origin: 'DayController.deleteEventItem',
                data: { eventId }
            });
        }

        if (!isUuid(itemId)) {
            throw new UnprocessableError(ErrorCode.InvalidEventItemId, 'Invalid item ID', {
                origin: 'DayController.deleteEventItem',
                data: { userId: context.userId, date, eventId, itemId }
            });
        }

        const eventResource: IDayEventItemUpdate = updateEventItemSchema.parse(resource);

        return this.dayService.updateEventItem(context.userId, date, eventId, itemId, eventResource);
    }

    public async deleteEventItem(context: IAuthenticatedContext, date: unknown, eventId: unknown, itemId: unknown): Promise<void> {
        if (!isISODateString(date)) {
            throw new UnprocessableError(ErrorCode.InvalidDateString, 'Invalid date', {
                origin: 'DayController.deleteDay',
                data: { date }
            });
        }

        if (!isValidMongoId(eventId)) {
            throw new UnprocessableError(ErrorCode.InvalidEventId, 'Invalid event ID', {
                origin: 'DayController.deleteEventItem',
                data: { eventId }
            });
        }

        if (!isUuid(itemId)) {
            throw new UnprocessableError(ErrorCode.InvalidEventItemId, 'Invalid item ID', {
                origin: 'DayController.deleteEventItem',
                data: { userId: context.userId, date, eventId, itemId }
            });
        }

        return this.dayService.deleteEventItem(date, context.userId, eventId, itemId);
    }
}
