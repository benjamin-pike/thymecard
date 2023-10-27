import express from 'express';
import { errorHandler } from '../../lib/error/error.utils';
import { AuthProvider } from '../user/user.types';
import { IDependencies } from '../../lib/types/server.types';
import { IRoutePermissions } from '../../lib/auth/permissions';
import HTTP_STATUS_CODES from 'http-status-enum';

export const authRouter = (dependencies: IDependencies) => {
    const { authController, userController } = dependencies;

    const router = express.Router();

    // Local
    router
        .post(
            '/login',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { email, password } = req.body;
                const { user, tokens } = await authController.validatePasswordAndLogin(context, email, password);

                res.status(HTTP_STATUS_CODES.OK).json({ user, tokens });
            })
        )
        .post(
            '/register',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const user = await userController.createLocalUser(context, req.body);
                const tokens = await authController.loginPrevalidatedUser(context, user);

                res.status(HTTP_STATUS_CODES.CREATED).json({ user, tokens });
            })
        )
        .get(
            '/tokens',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const refreshToken = req.headers.authorization?.split(' ')[1];
                const newTokens = await authController.refreshAccessToken(context, refreshToken);

                res.status(HTTP_STATUS_CODES.OK).json({ tokens: newTokens });
            })
        );
    router
        .get(
            '/google',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const redirectUrl = await authController.getGoogleAuthUrl(context);
                res.redirect(redirectUrl);
            })
        )
        .get(
            '/google/callback',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { code } = req.query;

                const googleUser = await authController.getGoogleUserProfile(context, code);
                const user = await userController.getOrCreateOAuthUser(
                    context,
                    googleUser.id,
                    googleUser.email,
                    googleUser,
                    AuthProvider.Google
                );
                const tokens = await authController.loginPrevalidatedUser(context, user);

                res.status(HTTP_STATUS_CODES.OK).json({ user, tokens });
            })
        )
        .get(
            '/facebook',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const redirectUrl = await authController.getFacebookAuthUrl(context);
                res.redirect(redirectUrl);
            })
        )
        .get(
            '/facebook/callback',
            errorHandler(async (req, res) => {
                const context = req.context.getAnonContext();
                const { code, state } = req.query;

                const facebookProfile = await authController.getFacebookUserProfile(context, code, state);
                const user = await userController.getOrCreateOAuthUser(
                    context,
                    facebookProfile.id,
                    facebookProfile.email,
                    facebookProfile,
                    AuthProvider.Facebook
                );
                const tokens = await authController.loginPrevalidatedUser(context, user);

                res.status(HTTP_STATUS_CODES.OK).json({ user, tokens });
            })
        );
    return router;
};

export const authPermissions: IRoutePermissions = {
    'POST /auth/login': [],
    'POST /auth/register': [],
    'GET /auth/tokens': [],
    'GET /auth/google': [],
    'GET /auth/google/callback': [],
    'GET /auth/facebook': [],
    'GET /auth/facebook/callback': []
};
