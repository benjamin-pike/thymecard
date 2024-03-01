export const ROUTES = {
    PROXY: '/proxy',
    DAYS: {
        GET_DAYS: '/days',
        CREATE_DAY: '/days',
        DELETE_DAY: '/days/:date',
        COPY_DAY: '/days/:date/copy',
        CREATE_EVENT: '/days/:date/events',
        UPDATE_EVENT: '/days/:date/events/:eventId',
        DELETE_EVENT: '/days/:date/events/:eventId',
        UPDATE_EVENT_ITEM: '/days/:date/events/:eventId/items/:itemId',
        DELETE_EVENT_ITEM: '/days/:date/events/:eventId/items/:itemId',
        CREATE_EVENT_BOOKMARK: '/event-bookmarks',
        GET_EVENT_BOOKMARKS: '/event-bookmarks',
        SEARCH_EVENT_BOOMARKS: '/event-bookmarks/search'
    },
    RECIPES: {
        CREATE: '/recipes',
        GET: '/recipes/:recipeId',
        UPDATE: '/recipes/:recipeId',
        DELETE: '/recipes/:recipeId',
        SUMMARIES: '/recipes/summary',
        SEARCH: '/recipes/search',
        SEARCH_GOOGLE: '/recipes/search/google'
    }
} as const;
