import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { enrichError } from '../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';

export const recipeRouter = (dependencies: IDependencies) => {
    const { recipeController } = dependencies;

    const router = express.Router();

    router
        .post('/', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.create');
            try {
                const recipe = await recipeController.createRecipe(context, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ recipe });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.getAll');
            try {
                const recipes = await recipeController.getRecipes(context);
                res.status(HTTP_STATUS_CODES.OK).json({ recipes });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/:recipeId', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.getById');
            try {
                const recipe = await recipeController.getRecipe(context, req.params.recipeId);
                res.status(HTTP_STATUS_CODES.OK).json({ recipe });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .put('/:recipeId', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.update');
            try {
                const recipe = await recipeController.updateRecipe(context, req.params.recipeId, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ recipe });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .delete('/:recipeId', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.delete');
            try {
                await recipeController.deleteRecipe(context, req.params.recipeId);
                res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .post('/parse', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.parse');
            try {
                const parsedRecipe = await recipeController.parseRecipe(context, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ parsedRecipe });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .post('/:recipeId/comments', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.createComment');
            try {
                const comments = await recipeController.createComment(context, req.params.recipeId, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ comments });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/:recipeId/comments', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.getComments');
            try {
                const comments = await recipeController.getComments(context, req.params.recipeId);
                res.status(HTTP_STATUS_CODES.OK).json({ comments });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .delete('/:recipeId/comments/:commentId', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.deleteComment');
            try {
                await recipeController.deleteComment(context, req.params.recipeId, req.params.commentId);
                res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
            } catch (err) {
                next(enrichError(err, context));
            }
        });

    return router;
};

export const recipePermissions: IRoutePermissions = {
    'POST /recipes': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'GET /recipes': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'GET /recipes/:id': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'PUT /recipes/:id': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'DELETE /recipes/:id': [{ scope: AccessScope.Recipe, permission: Permission.DELETE }],
    'POST /recipes/parse': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'POST /recipes/:id/comments': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'GET /recipes/:id/comments': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'DELETE /recipes/:id/comments/:commentId': [{ scope: AccessScope.Recipe, permission: Permission.DELETE }]
};
