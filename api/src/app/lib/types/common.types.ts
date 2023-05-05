export interface IPagedResult<T> {
    data: T[];
    page: {
        count: number;
        limit: number;
        startKey: string | null;
        nextKey: string | null;
    }
}