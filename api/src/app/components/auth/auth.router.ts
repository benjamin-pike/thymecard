import express from 'express';
import { credentialPermissions, credentialRouter } from './credential/credential.router';
import { oauthPermissions, oauthRouter } from './oauth/oauth.router';
import { sessionPermissions, sessionRouter } from './session/session.router';
import { IDependencies } from '../../lib/types/server.types';
import { IRoutePermissions } from '../../lib/auth/permissions';

export const authRouter = (dependencies: IDependencies) => {
    const router = express.Router();

    router.use('/credential', credentialRouter(dependencies));
    router.use('/session', sessionRouter(dependencies));
    router.use('/oauth', oauthRouter(dependencies));

    return router;
};

export const authPermissions: IRoutePermissions = {
    ...credentialPermissions,
    ...sessionPermissions,
    ...oauthPermissions
};
