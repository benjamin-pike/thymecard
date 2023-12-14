import express from 'express';
import { IDependencies } from '../../../lib/types/server.types';
import { errorHandler } from '../../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';
import { AccessScope, IRoutePermissions, Permission } from '../../../lib/auth/permissions';

export const sessionRouter = (dependencies: IDependencies) => {
    const { env, sessionController, credentialController, userController } = dependencies;

    const router = express.Router();

    router
        .post(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { email, password } = req.body;

                const credential = await credentialController.getByEmail(context, email, true);
                const session = await sessionController.login(context, credential, password);
                const user = await userController.getUserById(context, session.userId);

                const { password: _, ...credentialWithoutPassword } = credential;

                res.status(HTTP_STATUS_CODES.CREATED).json({ session, user, credential: credentialWithoutPassword });
            })
        )
        .delete(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();

                await sessionController.logoutAll(context);

                res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
            })
        )
        .delete(
            '/:sessionId',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const sessionId = req.params.sessionId;

                await sessionController.logout(context, sessionId);

                res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
            })
        )
        .post(
            '/exchange',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { credentialId, token } = req.body;

                const session = await sessionController.exchangeToken(context, credentialId, token);
                const user = await userController.getUserById(context, session.userId);

                res.status(HTTP_STATUS_CODES.CREATED).json({ session, user });
            })
        );
    return router;
};

export const sessionPermissions: IRoutePermissions = {
    'POST /auth/session': [],
    'DELETE /auth/session': [{ scope: AccessScope.AUTH, permission: Permission.DELETE }],
    'DELETE /auth/session/:sessionId': [{ scope: AccessScope.AUTH, permission: Permission.DELETE }],
    'POST /auth/session/exchange': []
};
