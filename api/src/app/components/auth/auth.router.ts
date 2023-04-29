import express from 'express';
import { enrichError } from '../../lib/error/error.utils';
import { AuthProvider } from '../user/user.types';
import { IDependencies } from '../../lib/types/server.types';
import { IRoutePermissions } from '../../lib/auth/permissions';

export const authRouter = (dependencies: IDependencies) => {
    const { authController, userController } = dependencies;

    const router = express.Router();

    // Local
    router
        .post('/login', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.login');
            try {
                const { email, password } = req.body;
                const { user, tokens } = await authController.validatePasswordAndLogin(context, email, password);

                res.status(200).json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .post('/register', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.register');
            try {
                const user = await userController.createLocalUser(context, req.body);
                const tokens = await authController.loginPrevalidatedUser(context, user);

                res.status(201).json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .post('/tokens', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.tokens');
            try {
                const { refreshToken } = req.body;
                const newTokens = await authController.refreshAccessToken(context, refreshToken);

                res.status(200).json({ tokens: newTokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        });

    // OAuth
    router
        .get('/google', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.google');
            try {
                const redirectUrl = await authController.getGoogleAuthUrl(context);
                res.redirect(redirectUrl);
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/google/callback', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.googleCallback');
            try {
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

                res.status(200).json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/facebook', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.facebook');
            try {
                const redirectUrl = await authController.getFacebookAuthUrl(context);
                res.redirect(redirectUrl);
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/facebook/callback', async (req, res, next) => {
            const context = req.context.validateContext('authRouter.facebookCallback');
            try {
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

                return res.json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        });
    return router;
};

export const authPermissions: IRoutePermissions = {
    'POST /auth/login': [],
    'POST /auth/register': [],
    'POST /auth/tokens': [],
    'GET /auth/google': [],
    'GET /auth/google/callback': [],
    'GET /auth/facebook': [],
    'GET /auth/facebook/callback': []
};
