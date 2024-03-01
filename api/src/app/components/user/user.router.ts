import express from 'express';
import multer from 'multer';
import HTTP_STATUS_CODES from 'http-status-enum';
import { IDependencies } from '../../lib/types/server.types';
import { errorHandler } from '../../lib/error/error.utils';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';

export const userRouter = (dependencies: IDependencies) => {
    const { userController, credentialController, sessionController } = dependencies;

    const router = express.Router();
    const upload = multer();

    return router
        .post(
            '/',
            upload.single('image'),
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();

                const credentialId = req.query.credentialId;
                const resource = req.body;
                const image = req.file;

                const credential = await credentialController.get(context, credentialId);
                const user = await userController.createUser(context, credential, resource, image);
                const { password: _, ...safeCredential } = await credentialController.linkToUser(context, credentialId, user._id);
                const session = await sessionController.create(context, credential);

                res.status(HTTP_STATUS_CODES.CREATED).json({ user, credential: safeCredential, session });
            })
        )
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
    'POST /users': [],
    'GET /users/:userId': [{ scope: AccessScope.USER, permission: Permission.READ }],
    'PUT /users/:userId': [{ scope: AccessScope.USER, permission: Permission.WRITE }],
    'DELETE /users/:userId': [{ scope: AccessScope.USER, permission: Permission.DELETE }]
};
