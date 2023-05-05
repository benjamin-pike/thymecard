import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { errorHandler } from '../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';

export const recipeRouter = (dependencies: IDependencies) => {
    const { recipeController } = dependencies;

    const router = express.Router();

    router
        .post(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const recipe = await recipeController.createRecipe(context, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ recipe });
            })
        )
        .get(
            '/summary',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const summaries = await recipeController.getSummaries(context);
                res.status(HTTP_STATUS_CODES.OK).json({ summaries });
            })
        )
        .post(
            '/parse',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const parsedRecipe = await recipeController.parseRecipe(context, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ parsedRecipe });
            })
        )
        .get(
            '/:recipeId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const recipe = await recipeController.getRecipe(context, req.params.recipeId);
                res.status(HTTP_STATUS_CODES.OK).json({ recipe });
            })
        )
        .put(
            '/:recipeId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const recipe = await recipeController.updateRecipe(context, req.params.recipeId, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ recipe });
            })
        )
        .delete(
            '/:recipeId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                await recipeController.deleteRecipe(context, req.params.recipeId);
                res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
            })
        )
        .get(
            '/:recipeId/summary',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const summary = await recipeController.getSummary(context, req.params.recipeId);
                res.status(HTTP_STATUS_CODES.OK).json({ summary });
            })
        )
        .post(
            '/:recipeId/comments',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const comments = await recipeController.createComment(context, req.params.recipeId, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ comments });
            })
        )
        .get(
            '/:recipeId/comments',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const comments = await recipeController.getComments(context, req.params.recipeId);
                res.status(HTTP_STATUS_CODES.OK).json({ comments });
            })
        )
        .delete(
            '/:recipeId/comments/:commentId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                await recipeController.deleteComment(context, req.params.recipeId, req.params.commentId);
                res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
            })
        );

    return router;
};

export const recipePermissions: IRoutePermissions = {
    'POST /recipes': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'GET /recipes/summary': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'POST /recipes/parse': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'GET /recipes/:recipeId': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'PUT /recipes/:recipeId': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'DELETE /recipes/:recipeId': [{ scope: AccessScope.Recipe, permission: Permission.DELETE }],
    'GET /recipes/:recipeId/summary': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'POST /recipes/:recipeId/comments': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'GET /recipes/:recipeId/comments': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'DELETE /recipes/:recipeId/comments/:commentId': [{ scope: AccessScope.Recipe, permission: Permission.DELETE }]
};
