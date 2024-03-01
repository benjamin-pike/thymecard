import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { errorHandler } from '../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';

export const dayRouter = (dependencies: IDependencies) => {
    const { dayController } = dependencies;

    const router = express.Router();

    router
        .post(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const day = await dayController.createDay(context, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ day });
            })
        )
        .get(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { startDate, limit } = req.query;
                const days = await dayController.getDays(context, startDate, limit);
                res.status(HTTP_STATUS_CODES.OK).json(days);
            })
        )
        .get(
            '/:date',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const day = await dayController.getDay(context, req.params.date);
                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .put(
            '/:date',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const day = await dayController.updateDay(context, req.params.date, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .delete(
            '/:date',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                await dayController.deleteDay(context, req.params.date);
                res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
            })
        )
        .post(
            '/:date/copy',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { targetDate, excludedEvents } = req.body;

                const day = await dayController.copyDay(context, req.params.date, targetDate, excludedEvents);

                res.status(HTTP_STATUS_CODES.CREATED).send({ day });
            })
        )
        .post(
            '/:date/events',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();

                const day = await dayController.createEvent(context, req.params.date, req.body);

                res.status(HTTP_STATUS_CODES.CREATED).json({ day });
            })
        )
        .put(
            '/:date/events/:eventId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const day = await dayController.updateEvent(context, req.params.date, req.params.eventId, req.body);

                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .delete(
            '/:date/events/:eventId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();

                await dayController.deleteEvent(context, req.params.date, req.params.eventId);

                res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
            })
        )
        .put(
            '/:date/events/:eventId/items/:itemId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { date, eventId, itemId } = req.params;
                const day = await dayController.updateEventItem(context, date, eventId, itemId, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .delete(
            '/:date/events/:eventId/items/:itemId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { date, eventId, itemId } = req.params;
                await dayController.deleteEventItem(context, date, eventId, itemId);
                
                res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
            })
        )

    return router;
};

export const dayPermissions: IRoutePermissions = {
    'POST /days': [{ scope: AccessScope.DAY, permission: Permission.WRITE }],
    'GET /days': [{ scope: AccessScope.DAY, permission: Permission.READ }],
    'GET /days/:date': [{ scope: AccessScope.DAY, permission: Permission.READ }],
    'PUT /days/:date': [{ scope: AccessScope.DAY, permission: Permission.WRITE }],
    'DELETE /days/:date': [{ scope: AccessScope.DAY, permission: Permission.DELETE }],
    'POST /days/:date/copy': [{ scope: AccessScope.DAY, permission: Permission.WRITE }],
    'POST /days/:date/events': [{ scope: AccessScope.DAY, permission: Permission.WRITE }],
    'PUT /days/:date/events/:eventId': [{ scope: AccessScope.DAY, permission: Permission.WRITE }],
    'DELETE /days/:date/events/:eventId': [{ scope: AccessScope.DAY, permission: Permission.DELETE }],
    'PUT /days/:date/events/:eventId/items/:itemId': [{ scope: AccessScope.DAY, permission: Permission.WRITE }],
    'DELETE /days/:date/events/:eventId/items/:itemId': [{ scope: AccessScope.DAY, permission: Permission.DELETE }],
};
