import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { enrichError } from '../../lib/error/error.utils';

export const recipeRouter = (dependencies: IDependencies) => {
    const { recipeController } = dependencies;
    
    const router = express.Router();

    router
        .post('/parse', async (req, res, next) => {
            const context = req.context.validateAuthContext('recipeRouter.parse');
            try {
                const recipe = await recipeController.parseRecipe(context, req.body);
                res.status(200).json({ recipe });
            } catch(err) {
                next(enrichError(err, context));
            }
        })
    return router;
};

export const recipePermissions: IRoutePermissions = {
    'POST /recipes/parse': [{ scope: AccessScope.Recipe, permission: Permission.WRITE }],
};
