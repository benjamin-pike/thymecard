import { ZodError } from 'zod';
import { UnprocessableError } from '../../lib/error/thymecardError';
import { hasKey, isDefined, isNonEmptyString, isNumber, isPlainObject, isYearMonthDayDateString, parseBooleanOrFalse } from '../../lib/types/typeguards.utils';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IDayService } from './day.service';
import {
    IDay,
    IDayCreate,
    IDayEnriched,
    IDayUpdate,
    IMealCreate,
    IMealUpdate,
    createDaySchema,
    createMealSchema,
    updateDaySchema,
    updateMealSchema
} from './day.types';
import { formatZodError } from '../../lib/error/error.utils';
import { IPagedResult } from '../../lib/types/common.types';
import { ErrorCode } from '@thymecard/types';

interface IDayControllerDependencies {
    dayService: IDayService;
}

export interface IDayController {
    createDay(context: IAuthenticatedContext, resource: unknown): Promise<IDay>;
    updateDay(context: IAuthenticatedContext, dayId: string, resource: unknown): Promise<IDay>;
    getDays(context: IAuthenticatedContext, enrichedString: unknown, startKey?: unknown, limitString?: unknown): Promise<IPagedResult<IDay>>;
    getDay(context: IAuthenticatedContext, dayId: unknown, enrichedString: unknown): Promise<IDay>
    deleteDay(context: IAuthenticatedContext, dayId: string): Promise<void>;
    createMeal(context: IAuthenticatedContext, dayId: string, resource: unknown): Promise<IDay>;
    updateMeal(context: IAuthenticatedContext, dayId: string, mealId: string, resource: unknown): Promise<IDay>;
    deleteMeal(context: IAuthenticatedContext, dayId: string, mealId: string): Promise<void>;
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

            if (!hasKey(resource, 'date') || !isYearMonthDayDateString(resource.date)) {
                throw new UnprocessableError(ErrorCode.InvalidDateString, 'An invalid date string was provided', {
                    origin: 'DayController.createDay',
                    data: { resource }
                });
            }

            const date = new Date(resource.date);
            const dayResource: IDayCreate = createDaySchema.parse({ ...resource, date, userId: context.userId });

            if (dayResource.meals.length === 0) {
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

    public async updateDay(context: IAuthenticatedContext, dayId: string, resource: unknown): Promise<IDay> {
        try {
            if (!isPlainObject(resource)) {
                throw new UnprocessableError(ErrorCode.InvalidDayUpdateResource, 'Invalid day update resource', {
                    origin: 'DayController.updateDay',
                    data: { resource }
                });
            }

            const dateString = hasKey(resource, 'date') ? resource.date : undefined;
            if (isDefined(dateString) && !isYearMonthDayDateString(dateString)) {
                throw new UnprocessableError(ErrorCode.InvalidDateString, 'An invalid date string was provided', {
                    origin: 'DayController.updateDay',
                    data: { resource }
                });
            }
            const date = dateString ? new Date(dateString) : undefined;
            const dayResource: IDayUpdate = updateDaySchema.parse({ ...resource, date });

            return this.dayService.updateDay(dayId, context.userId, dayResource);
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

    public async getDays(context: IAuthenticatedContext, enrichedString: unknown, startKey?: unknown, limitString?: unknown): Promise<IPagedResult<IDay>> {
        if (isDefined(startKey) && !isNonEmptyString(startKey)) {
            throw new UnprocessableError(ErrorCode.InvalidPageStartKey, 'Invalid page start key', {
                origin: 'DayController.getDays',
                data: { startKey }
            });
        }

        const limit = isNonEmptyString(limitString) ? parseInt(limitString) : undefined;
        if (isDefined(limit) && !isNumber(limit)) {
            throw new UnprocessableError(ErrorCode.InvalidPageLimit, 'Invalid page limit', {
                origin: 'DayController.getDays',
                data: { limit }
            });
        }

        if (isDefined(limit) && limit > 100) {
            throw new UnprocessableError(ErrorCode.InvalidPageLimit, 'Page limit must be less than or equal to 100', {
                origin: 'DayController.getDays',
                data: { limit }
            });
        }

        const enriched = parseBooleanOrFalse(enrichedString)


        if (enriched) {
            return this.dayService.getEnrichedDays(context.userId, startKey, limit);
        }

        return this.dayService.getDays(context.userId, startKey, limit);
    }

    public async getDay(context: IAuthenticatedContext, dayId: unknown, enrichedString: unknown): Promise<IDay | IDayEnriched> {
        if (!isNonEmptyString(dayId)) {
            throw new UnprocessableError(ErrorCode.InvalidDayId, 'Invalid day id', {
                origin: 'DayController.getDay',
                data: { dayId }
            });
        }

        const enriched = parseBooleanOrFalse(enrichedString)

        if (enriched) {
            return this.dayService.getEnrichedDay(dayId, context.userId);
        }

        return this.dayService.getDay(dayId, context.userId);
    }

    public async deleteDay(context: IAuthenticatedContext, dayId: string): Promise<void> {
        return this.dayService.deleteDay(dayId, context.userId);
    }

    public async createMeal(context: IAuthenticatedContext, dayId: string, resource: unknown): Promise<IDay> {
        try {
            const mealResource: IMealCreate = createMealSchema.parse(resource);

            return this.dayService.createMeal(dayId, context.userId, mealResource);
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

    public async updateMeal(context: IAuthenticatedContext, dayId: string, mealId: string, resource: unknown): Promise<IDay> {
        try {
            const mealResource: IMealUpdate = updateMealSchema.parse(resource);

            return this.dayService.updateMeal(dayId, context.userId, mealId, mealResource);
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

    public async deleteMeal(context: IAuthenticatedContext, dayId: string, mealId: string): Promise<void> {
        return this.dayService.deleteMeal(dayId, context.userId, mealId);
    }
}
