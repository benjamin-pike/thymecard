import { IPagedResult } from '../../lib/types/common.types';
import {
    IActivityEvent,
    IActivityEventBookmark,
    IActivityEventBookmarkCreate,
    IMealEvent,
    IMealEventBookmark,
    IMealEventBookmarkCreate
} from '@thymecard/types';
import { activityEventBookmarkRepository } from './models/activityEventBookmark.model';
import { mealEventBookmarkRepository } from './models/mealEventBookmark.model';

export interface IEventBookmarkService {
    createMealEventBookmark(
        userId: string,
        bookmarkName: string,
        includeType: boolean,
        includeTime: boolean,
        includeDuration: boolean,
        excludedItems: string[],
        event: IMealEvent
    ): Promise<IMealEventBookmark>;
    createActivityEventBookmark(
        userId: string,
        bookmarkName: string,
        includeType: boolean,
        includeTime: boolean,
        includeDuration: boolean,
        excludedItems: string[],
        event: IActivityEvent
    ): Promise<IActivityEventBookmark>;
    getMealEventBookmarks(userId: string, nextKey?: string): Promise<IPagedResult<IMealEventBookmark>>;
    getActivityEventBookmarks(userId: string, nextKey?: string): Promise<IPagedResult<IActivityEventBookmark>>;
    searchMealEventBookmarks(userId: string, query: string): Promise<IPagedResult<IMealEventBookmark>>;
    searchActivityEventBookmarks(userId: string, query: string): Promise<IPagedResult<IActivityEventBookmark>>;
}

export class EventBookmarkService implements IEventBookmarkService {
    public async createMealEventBookmark(
        userId: string,
        bookmarkName: string,
        includeType: boolean,
        includeTime: boolean,
        includeDuration: boolean,
        excludedItems: string[],
        event: IMealEvent
    ): Promise<IMealEventBookmark> {
        const { _id: _mealEventId, ...mealEvent } = event;

        const createResource: IMealEventBookmarkCreate = {
            name: bookmarkName,
            type: includeType ? mealEvent.type : undefined,
            time: includeTime ? mealEvent.time : undefined,
            duration: includeDuration ? mealEvent.duration : undefined,
            items: mealEvent.items.filter((item) => !excludedItems.includes(item.id)),
            userId
        };

        const bookmark = await mealEventBookmarkRepository.create(createResource);

        return bookmark;
    }

    public async createActivityEventBookmark(
        userId: string,
        bookmarkName: string,
        includeType: boolean,
        includeTime: boolean,
        includeDuration: boolean,
        excludedItems: string[],
        event: IActivityEvent
    ): Promise<IActivityEventBookmark> {
        const { _id: _activityEventId, ...activityEvent } = event;

        const createResource: IActivityEventBookmarkCreate = {
            name: bookmarkName,
            type: includeType ? activityEvent.type : undefined,
            time: includeTime ? activityEvent.time : undefined,
            duration: includeDuration ? activityEvent.duration : undefined,
            items: activityEvent.items.filter((item) => !excludedItems.includes(item.id)),
            userId
        };

        const bookmark = await activityEventBookmarkRepository.create(createResource);

        return bookmark;
    }

    public async getMealEventBookmarks(userId: string, nextKey?: string): Promise<IPagedResult<IMealEventBookmark>> {
        const filter = {
            userId
        };

        return await mealEventBookmarkRepository.getPaged(filter, nextKey, 5);
    }

    public async getActivityEventBookmarks(userId: string, nextKey?: string): Promise<IPagedResult<IActivityEventBookmark>> {
        const filter = {
            userId
        };

        return await activityEventBookmarkRepository.getPaged(filter, nextKey, 5);
    }

    public async searchMealEventBookmarks(userId: string, query: string): Promise<IPagedResult<IMealEventBookmark>> {
        const filter = {
            userId,
            name: { $regex: query.toLowerCase(), $options: 'i' }
        };

        return await mealEventBookmarkRepository.getPaged(filter, null, 5);
    }

    public async searchActivityEventBookmarks(userId: string, query: string): Promise<IPagedResult<IActivityEventBookmark>> {
        const filter = {
            userId,
            name: { $regex: query.toLowerCase(), $options: 'i' }
        };

        return await activityEventBookmarkRepository.getPaged(filter, null, 5);
    }
}
