import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { errorHandler } from '../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';

export const eventBookmarkRouter = (dependencies: IDependencies) => {
    const { eventBookmarkController } = dependencies;

    const router = express.Router();

    router
        .post(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { bookmarkType } = req.query;

                const day = await eventBookmarkController.create(context, bookmarkType, req.body);

                res.status(HTTP_STATUS_CODES.CREATED).json({ day });
            })
        )
        .get(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { bookmarkType, nextKey } = req.query;

                const days = await eventBookmarkController.get(context, bookmarkType, nextKey);

                res.status(HTTP_STATUS_CODES.OK).json(days);
            })
        )
        .get(
            '/search',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { query, bookmarkType } = req.query;

                const results = await eventBookmarkController.search(context, bookmarkType, query);

                res.status(HTTP_STATUS_CODES.OK).json(results);
            })
        );

    return router;
};

export const eventBookmarkPermissions: IRoutePermissions = {
    'POST /event-bookmarks': [{ scope: AccessScope.EVENT_BOOKMARK, permission: Permission.WRITE }],
    'GET /event-bookmarks': [{ scope: AccessScope.EVENT_BOOKMARK, permission: Permission.READ }],
    'GET /event-bookmarks/search': [{ scope: AccessScope.EVENT_BOOKMARK, permission: Permission.READ }]
};
