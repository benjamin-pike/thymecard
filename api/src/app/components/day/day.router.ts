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
        .put(
            '/:dayId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { dayId } = req.params;
                const day = await dayController.updateDay(context, dayId, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .get(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { enriched, startKey, limit } = req.query;
                const days = await dayController.getDays(context, enriched, startKey, limit);
                res.status(HTTP_STATUS_CODES.OK).json({ days });
            })
        )
        .get(
            '/:dayId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { dayId } = req.params;
                const { enriched } = req.query;
                const day = await dayController.getDay(context, dayId, enriched);
                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .delete(
            '/:dayId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { dayId } = req.params;
                await dayController.deleteDay(context, dayId);
                res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
            })
        )
        .post(
            '/:dayId/meals',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { dayId } = req.params;
                const day = await dayController.createMeal(context, dayId, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ day });
            })
        )
        .put(
            '/:dayId/meals/:mealId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const day = await dayController.updateMeal(context, req.params.dayId, req.params.mealId, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ day });
            })
        )
        .delete(
            '/:dayId/meals/:mealId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                await dayController.deleteMeal(context, req.params.dayId, req.params.mealId);
                res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
            })
        )

    return router;
};

export const dayPermissions: IRoutePermissions = {
    'POST /days': [{ scope: AccessScope.Day, permission: Permission.WRITE }],
    'GET /days': [{ scope: AccessScope.Day, permission: Permission.READ }],
    'GET /days/:dayId': [{ scope: AccessScope.Day, permission: Permission.READ }],
    'PUT /days/:dayId': [{ scope: AccessScope.Day, permission: Permission.WRITE }],
    'DELETE /days/:dayId': [{ scope: AccessScope.Day, permission: Permission.DELETE }],
    'POST /days/:dayId/meals': [{ scope: AccessScope.Day, permission: Permission.WRITE }],
    'PUT /days/:dayId/meals/:mealId': [{ scope: AccessScope.Day, permission: Permission.WRITE }],
    'DELETE /days/:dayId/meals/:mealId': [{ scope: AccessScope.Day, permission: Permission.DELETE }]
};
