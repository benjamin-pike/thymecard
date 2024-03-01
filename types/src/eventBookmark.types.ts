export enum EEventBookmarkType {
    MEAL = 'meal',
    ACTIVITY = 'activity'
}

export const isEventBookmarkType = (type: unknown): type is EEventBookmarkType => {
    return type === EEventBookmarkType.MEAL || type === EEventBookmarkType.ACTIVITY;
}