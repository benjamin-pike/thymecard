import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { enrichError } from '../../lib/error/error.utils';
import { excludeResFields, includeResFields } from '../../middleware/resFilter.middleware';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';

export const userRouter = (dependencies: IDependencies) => {
    const { userController } = dependencies;

    const router = express.Router();

    router.use(excludeResFields('user', ['password']));
    router.use(includeResFields('user', ['createdAt', 'updatedAt']));

    return router
        .get('/:userId', async (req, res, next) => {
            const context = req.context.validateAuthContext('userRouter.get');
            try {
                const user = await userController.getUserById(context, req.params.userId);
                res.status(200).json({ user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .put('/:userId', async (req, res, next) => {
            const context = req.context.validateAuthContext('userRouter.put');
            try {
                const user = await userController.updateUser(context, req.params.userId, req.body);
                res.status(200).json({ user });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .delete('/:userId', async (req, res, next) => {
            const context = req.context.validateAuthContext('userRouter.delete');
            try {
                await userController.deleteUser(context, req.params.userId);
                res.status(204).end();
            } catch (err) {
                next(enrichError(err, context));
            }
        });
};

export const userPermissions: IRoutePermissions = {
    'GET /users/:userId': [{ scope: AccessScope.User, permission: Permission.READ }],
    'PUT /users/:userId': [{ scope: AccessScope.User, permission: Permission.WRITE }],
    'DELETE /users/:userId': [{ scope: AccessScope.User, permission: Permission.DELETE }]
};
