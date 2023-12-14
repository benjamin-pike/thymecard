import express from 'express';
import { IDependencies } from '../../../lib/types/server.types';
import { errorHandler } from '../../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';
import { IRoutePermissions } from '../../../lib/auth/permissions';
import { CredentialProvider } from '@thymecard/types';

export const credentialRouter = (dependencies: IDependencies) => {
    const { env, credentialController, sessionController } = dependencies;

    const router = express.Router();

    router
        .post(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const credential = await credentialController.create(context, req.body, CredentialProvider.THYMECARD);

                res.status(HTTP_STATUS_CODES.CREATED).json({ id: credential._id });
            })
        )
        .put(
            '/:credentialId/verify',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const credentialId = req.params.credentialId;
                const { verificationCode } = req.body;

                await credentialController.verify(context, credentialId, verificationCode);

                res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
            })
        );

    return router;
};

export const credentialPermissions: IRoutePermissions = {
    'POST /auth/credential': [],
    'PUT /auth/credential/:credentialId/verify': []
};
