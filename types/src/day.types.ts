import { Client} from "..";
import { EEventType, MealType } from "./event.types";

export interface IDay {
	_id: string;
	date: Date;
	events: IDayEvent[];
	userId: string;
}

export type IDayRead = {
	id: string;
	date: string;
	events: Client<IDayEvent[]>;
};

export interface IDayEvent {
	_id: string;
	type: EEventType;
	time: number;
	duration: number;
	items: IDayEventItem[];
	bookmarkId?: string;
}

export interface IMealEvent extends IDayEvent {
	type: MealType;
	items: IMealEventItem[];
}

export interface IActivityEvent extends IDayEvent {
	type: EEventType.ACTIVITY;
	items: IActivityEventItem[];
}

export const isMealEvent = (event: IDayEvent): event is IMealEvent => {
	return event.type !== EEventType.ACTIVITY;
};

export const isActivityEvent = (event: IDayEvent): event is IActivityEvent => {
	return event.type === EEventType.ACTIVITY;
};

export const extractMealEvents = (events: IDayEvent[]): IMealEvent[] => {
	return events.filter((event): event is IMealEvent => isMealEvent(event));
};

export const extractActivityEvents = (
	events: IDayEvent[]
): IActivityEvent[] => {
	return events.filter((event): event is IActivityEvent =>
		isActivityEvent(event)
	);
};

// Items
export interface IMealEventItem {
	id: string;
	name: string;
	servings: number;
	calories?: number;
	recipeId?: string;
	isFavorite?: boolean;
}

export interface IActivityEventItem {
	id: string;
	name: string;
	calories?: number;
	duration?: number;
	activityId?: string;
}

export type IDayEventItem = IMealEventItem | IActivityEventItem;

export type IMealEventItemUpdate = Partial<IMealEventItem>;
export type IActivityEventItemUpdate = Partial<IActivityEventItem>;
export type IDayEventItemUpdate =
	| IMealEventItemUpdate
	| IActivityEventItemUpdate;

// Events
export type IDayEventCreate = Omit<IDayEvent, "_id">;
export type IDayEventUpdate = Partial<IDayEventCreate>;

// Days
export type IDayCreate = Omit<IDay, "_id" | "events"> & {
	events: IDayEventCreate[];
};
export type IDayUpdate = Partial<IDayCreate>;

// Bookmarks
export interface IDayEventBookmark {
	_id: string;
	name: string;
	type: EEventType | undefined;
	time: number | undefined;
	duration: number | undefined;
	userId: string;
}

export interface IMealEventBookmark extends IDayEventBookmark {
	type: MealType | undefined;
	items: IMealEventItem[];
}

export interface IActivityEventBookmark extends IDayEventBookmark {
	type: EEventType.ACTIVITY | undefined;
	items: IActivityEventItem[];
}

export type IMealEventBookmarkCreate = Omit<IMealEventBookmark, "_id">;
export type IActivityEventBookmarkCreate = Omit<IActivityEventBookmark, "_id">;

export interface IDayEventBookmarkRequestBody {
	eventDate: string;
	eventId: string;
	bookmarkName: string;
	includeType: boolean;
	includeTime: boolean;
	includeDuration: boolean;
	excludedItems: string[];
}