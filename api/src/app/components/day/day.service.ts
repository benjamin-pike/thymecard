import { buildSetQueryFromUpdate } from '../../lib/data/mongo.utils';
import { NotFoundError } from '../../lib/error/thymecardError';
import { DayCache } from '../../lib/types/cache.types';
import { dayRepository } from './day.model';
import { IPagedResult } from '../../lib/types/common.types';
import { SortQuery } from '../../lib/data/mongo.repository';
import {
    ErrorCode,
    IDay,
    IDayCreate,
    IDayEventBookmark,
    IDayEventCreate,
    IDayEventItemUpdate,
    IDayEventUpdate,
    IDayUpdate
} from '@thymecard/types';

interface IDayServiceDependencies {
    dayCache: DayCache;
}

export interface IDayService {
    createDay(day: IDayCreate): Promise<IDay>;
    updateDay(date: string, userId: string, update: IDayUpdate): Promise<IDay>;
    getDays(date: string, startDate: Date, limit: number): Promise<IPagedResult<IDay>>;
    getDay(date: string, userId: string): Promise<IDay>;
    deleteDay(date: string, userId: string): Promise<void>;
    copyDay(originDate: string, targetDate: string, userId: string, excludedEvents: string[]): Promise<IDay>;
    createEvent(date: string, userId: string, event: IDayEventCreate): Promise<IDay>;
    updateEvent(date: string, userId: string, eventId: string, update: IDayEventUpdate): Promise<IDay>;
    deleteEvent(date: string, userId: string, eventId: string): Promise<void>;
    updateEventItem(userId: string, date: string, eventId: string, itemId: string, update: IDayEventItemUpdate): Promise<IDay>;
    deleteEventItem(date: string, userId: string, eventId: string, itemId: string): Promise<void>;
}

export class DayService implements IDayService {
    private readonly cache: DayCache;

    constructor(deps: IDayServiceDependencies) {
        this.cache = deps.dayCache;
    }

    public async createDay(day: IDayCreate): Promise<IDay> {
        return dayRepository.create(day);
    }

    public async updateDay(date: string, userId: string, update: IDayUpdate): Promise<IDay> {
        const query = { date: new Date(date), userId };
        const updatedDay = await dayRepository.findOneAndUpdate(query, update);

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.updateDay',
                data: { date, userId, update }
            });
        }

        return updatedDay;
    }

    public async getDays(userId: string, startDate: Date, limit: number): Promise<IPagedResult<IDay>> {
        const query = { userId, date: { $gte: startDate } };
        const sortQuery: SortQuery = { date: 1 };

        return await dayRepository.getPaged(query, null, limit, sortQuery);
    }

    public async getDay(date: string, userId: string): Promise<IDay> {
        const query = { date: new Date(date), userId };
        const day = await dayRepository.getOne(query);

        if (!day) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.getDay',
                data: { date: new Date(date), userId }
            });
        }

        return day;
    }

    public async deleteDay(date: string, userId: string): Promise<void> {
        const query = { date: new Date(date), userId };
        const deletedDay = await dayRepository.delete(query);

        if (!deletedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.deleteDay',
                data: { date, userId }
            });
        }

        return;
    }

    public async copyDay(originDate: string, targetDate: string, userId: string, excludedEvents: string[]): Promise<IDay> {
        const originDay = await this.getDay(originDate, userId);
        const includedEvents = originDay.events.filter((event) => !excludedEvents.includes(event._id));

        const targetDay = await dayRepository.getOne({ date: new Date(targetDate), userId });
        const existingEvents = targetDay ? targetDay.events : [];

        const overlappingEvents = new Set<string>();
        for (const { _id: existingEventId, time, duration } of existingEvents) {
            const start = time;
            const end = time + duration;

            for (const event of includedEvents) {
                if (start < event.time + event.duration && end > event.time) {
                    overlappingEvents.add(existingEventId);
                }
            }
        }

        const events = [...includedEvents, ...existingEvents.filter((event) => !overlappingEvents.has(event._id))].sort(
            (a, b) => a.time - b.time
        );

        return await dayRepository.findOneAndUpdate({ date: new Date(targetDate), userId }, { events }, { upsert: true });
    }

    public async createEvent(date: string, userId: string, event: IDayEventCreate): Promise<IDay> {
        const query = { userId, date: new Date(date) };
        const update = {
            $push: {
                events: {
                    $each: [event],
                    $sort: { time: 1 } // Sort in ascending order based on event time
                }
            }
        };

        const updatedDay = await dayRepository.findOneAndUpdate(query, update, { upsert: true });

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.createEvent',
                data: { date, userId, event }
            });
        }

        return updatedDay;
    }

    public async updateEvent(date: string, userId: string, eventId: string, update: IDayEventUpdate): Promise<IDay> {
        const findQuery = { date: new Date(date), userId, 'events._id': eventId };
        const updateQuery = { $set: buildSetQueryFromUpdate(update, 'events.$') };

        let updatedDay = await dayRepository.findOneAndUpdate(findQuery, updateQuery);

        if (updatedDay) {
            const eventsAreSorted = updatedDay.events.every(
                (event, index, eventsArray) => index === 0 || event.time > eventsArray[index - 1].time
            );
            if (!eventsAreSorted) {
                const sortedEvents = updatedDay.events.sort((a, b) => a.time - b.time);
                const sortUpdateQuery = { $set: { events: sortedEvents } };

                updatedDay = await dayRepository.findOneAndUpdate(findQuery, sortUpdateQuery);
            }
        }

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Event not found', {
                origin: 'DayService.updateEvent',
                data: { date, userId, eventId, update }
            });
        }

        return updatedDay;
    }

    public async deleteEvent(date: string, userId: string, eventId: string): Promise<void> {
        const query = { date: new Date(date), userId };
        const update = {
            $pull: { events: { _id: eventId } }
        };

        const updatedDay = await dayRepository.findOneAndUpdate(query, update);

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.deleteEvent',
                data: { date, userId, eventId }
            });
        }

        if (updatedDay.events.length === 0) {
            await dayRepository.delete(query);
        }

        return;
    }

    public async updateEventItem(
        userId: string,
        date: string,
        eventId: string,
        itemId: string,
        update: IDayEventItemUpdate
    ): Promise<IDay> {
        const query = { date: new Date(date), userId, 'events._id': eventId };
        const updateQuery = {
            $set: buildSetQueryFromUpdate(update, 'events.$.items.$[item]')
        };
        const arrayFilters = [{ 'item.id': itemId }];

        const updatedDay = await dayRepository.findOneAndUpdate(query, updateQuery, { arrayFilters });

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.updateEventItem',
                data: { date, userId, eventId, itemId, update }
            });
        }

        return updatedDay;
    }

    public async deleteEventItem(date: string, userId: string, eventId: string, itemId: string): Promise<void> {
        const query = { date: new Date(date), userId, 'events._id': eventId };
        const update = {
            $pull: { 'events.$.items': { id: itemId } }
        };

        const updatedDay = await dayRepository.findOneAndUpdate(query, update);

        if (!updatedDay) {
            throw new NotFoundError(ErrorCode.DayNotFound, 'Day not found', {
                origin: 'DayService.deleteEventItem',
                data: { date, userId, eventId, itemId }
            });
        }
    }
}
