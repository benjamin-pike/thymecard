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
            } catch(err) {
                next(enrichError(err, context));
            }
        })
        .get('/', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.getAll');
            try {
                const recipes = await recipeController.getRecipes(context);
                res.status(HTTP_STATUS_CODES.OK).json({ recipes });
            } catch(err) {
                next(enrichError(err, context));
            }
        })
        .get('/:id', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.getById');
            try {
                const recipe = await recipeController.getRecipe(context, req.params.id);
                res.status(HTTP_STATUS_CODES.OK).json({ recipe });
            } catch(err) {
                next(enrichError(err, context));
            }
        })
        .put('/:id', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.update');
            try {
                const recipe = await recipeController.updateRecipe(context, req.params.id, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ recipe });
            } catch(err) {
                next(enrichError(err, context));
            }
        })
        .delete('/:id', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.delete');
            try {
                await recipeController.deleteRecipe(context, req.params.id);
                res.status(HTTP_STATUS_CODES.NO_CONTENT);
            } catch(err) {
                next(enrichError(err, context));
            }
        })
        .post('/parse', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.parse');
            try {
                const parsedRecipe = await recipeController.parseRecipe(context, req.body);
                res.status(HTTP_STATUS_CODES.CREATED).json({ parsedRecipe });
            } catch(err) {
                next(enrichError(err, context));
            }
        })
    return router;
};

export const recipePermissions: IRoutePermissions = {
    'POST /recipes': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'GET /recipes': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'GET /recipes/:id': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
    'PUT /recipes/:id': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
    'DELETE /recipes/:id': [{ scope: AccessScope.Recipe, permission: Permission.DELETE }],
    'POST /recipes/parse': [{ scope: AccessScope.Recipe, permission: Permission.READ }],
};
