import express from 'express';
import HTTP_STATUS_CODES from 'http-status-enum';
import { IDependencies } from '../../lib/types/server.types';
import { errorHandler } from '../../lib/error/error.utils';
import { excludeResFields, includeResFields } from '../../middleware/res-filter.middleware';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';

export const userRouter = (dependencies: IDependencies) => {
    const { userController } = dependencies;

    const router = express.Router();

    router.use(excludeResFields('user', ['password']));
    router.use(includeResFields('user', ['createdAt', 'updatedAt']));

    return router
        .get(
            '/:userId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const user = await userController.getUserById(context, req.params.userId);
                res.status(HTTP_STATUS_CODES.OK).json({ user });
            })
        )
        .put(
            '/:userId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const user = await userController.updateUser(context, req.params.userId, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ user });
            })
        )
        .delete(
            '/:userId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                await userController.deleteUser(context, req.params.userId);
                res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
            })
        );
};

export const userPermissions: IRoutePermissions = {
    'GET /users/:userId': [{ scope: AccessScope.User, permission: Permission.READ }],
    'PUT /users/:userId': [{ scope: AccessScope.User, permission: Permission.WRITE }],
    'DELETE /users/:userId': [{ scope: AccessScope.User, permission: Permission.DELETE }]
};
