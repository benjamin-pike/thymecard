import { IDayEventBookmarkRequestBody, isArrayOf, isBoolean, isString } from "@thymecard/types";

export const isDayEventBookmarkRequestBody = (
    obj: any
): obj is IDayEventBookmarkRequestBody => {
    return (
        obj &&
        isString(obj.eventDate) &&
        isString(obj.eventId) &&
        isString(obj.bookmarkName) &&
        isBoolean(obj.includeType) &&
        isBoolean(obj.includeTime) &&
        isBoolean(obj.includeDuration) &&
        isArrayOf(obj.excludedItems, isString)
    );
};
