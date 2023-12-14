import express from 'express';
import { IDependencies } from '../../../lib/types/server.types';
import { errorHandler } from '../../../lib/error/error.utils';
import { IRoutePermissions } from '../../../lib/auth/permissions';
import { CredentialProvider, ErrorCode, isDefined } from '@thymecard/types';
import HTTP_STATUS_CODES from 'http-status-enum';
import { ForbiddenError } from '../../../lib/error/thymecardError';
import { buildUrl } from '@thymecard/utils';

export const oauthRouter = (dependencies: IDependencies) => {
    const { env, oauthController, credentialController, sessionController } = dependencies;

    const router = express.Router();

    router
        .get(
            '/google',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const url = await oauthController.buildGoogleAuthUrl(context);
                res.status(HTTP_STATUS_CODES.OK).json({ url });
            })
        )
        .get(
            '/facebook',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const url = await oauthController.buildFacebookAuthUrl(context);
                res.status(HTTP_STATUS_CODES.OK).json({ url });
            })
        )
        .get(
            '/google/callback',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { code } = req.query;

                const profile = await oauthController.getGoogleProfile(context, code);

                let credential;
                try {
                    credential = await credentialController.findByOAuthIdOrEmail(profile.id, profile.email, CredentialProvider.GOOGLE);
                } catch (err) {
                    if (err instanceof ForbiddenError && err.internalCode === ErrorCode.CredentialProviderMismatch) {
                        return res.redirect(
                            buildUrl('/error', {
                                base: env.CLIENT_URL,
                                query: {
                                    message: err.message
                                }
                            })
                        );
                    }

                    throw err;
                }

                if (!credential) {
                    credential = await credentialController.create(
                        context,
                        {
                            OAuthId: profile.id,
                            email: profile.email
                        },
                        CredentialProvider.GOOGLE
                    );
                }

                if (!isDefined(credential.userId)) {
                    const url = buildUrl('/oauth/success', {
                        base: env.CLIENT_URL,
                        query: {
                            credentialId: credential._id,
                            firstName: profile.given_name,
                            lastName: profile.family_name
                        }
                    });

                    return res.redirect(url);
                }

                const token = sessionController.createToken(credential._id);

                const url = buildUrl('/exchange', {
                    base: env.CLIENT_URL,
                    query: {
                        credentialId: credential._id,
                        token
                    }
                });

                res.redirect(url);
            })
        )
        .get(
            '/facebook/callback',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { code, state } = req.query;

                const profile = await oauthController.getFacebookProfile(context, code, state);

                let credential;
                try {
                    credential = isDefined(profile.email)
                        ? await credentialController.findByOAuthIdOrEmail(profile.id, profile.email, CredentialProvider.FACEBOOK)
                        : await credentialController.findByOAuthId(profile.id, CredentialProvider.FACEBOOK);
                } catch (err) {
                    if (err instanceof ForbiddenError && err.internalCode === ErrorCode.CredentialProviderMismatch) {
                        return res.redirect(
                            buildUrl('/error', {
                                base: env.CLIENT_URL,
                                query: {
                                    message: err.message
                                }
                            })
                        );
                    }

                    throw err;
                }

                if (!credential) {
                    credential = await credentialController.create(
                        context,
                        {
                            OAuthId: profile.id,
                            email: profile.email
                        },
                        CredentialProvider.FACEBOOK
                    );
                }

                if (!isDefined(credential.userId)) {
                    const url = buildUrl('/oauth/success', {
                        base: env.CLIENT_URL,
                        query: {
                            credentialId: credential._id,
                            firstName: profile.first_name,
                            lastName: profile.last_name
                        }
                    });

                    return res.redirect(url);
                }

                const token = sessionController.createToken(credential._id);

                const url = buildUrl('/exchange', {
                    base: env.CLIENT_URL,
                    query: {
                        credentialId: credential._id,
                        token
                    }
                });

                res.redirect(url);
            })
        );

    return router;
};

export const oauthPermissions: IRoutePermissions = {
    'GET /auth/oauth/google': [],
    'GET /auth/oauth/facebook': [],
    'GET /auth/oauth/google/callback': [],
    'GET /auth/oauth/facebook/callback': []
};
