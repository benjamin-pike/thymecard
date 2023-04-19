import express from 'express';
import { IDependencies } from '../../../server';
import { validateContext } from '../../middleware/context.middleware';
import { enrichError } from '../../lib/error/error.utils';
import { AuthProvider } from '../user/user.types';

export const authRouter = (dependencies: IDependencies) => {
    const { authController, userController } = dependencies;

    const router = express.Router();

    // Local auth
    router
        .post('/login', async (req, res, next) => {
            const context = validateContext(req.context, 'authRouter.login');
            try {
                const { email, password } = req.body;
                const { user, tokens } = await authController.validatePasswordAndLogin(context, email, password);

                res.status(200).json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .post('/register', async (req, res, next) => {
            const context = validateContext(req.context, 'authRouter.register');
            try {
                const user = await userController.createLocalUser(context, req.body);
                const tokens = await authController.loginPrevalidatedUser(context, user);

                res.status(201).json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .post('/tokens', async (req, res, next) => {
            const context = validateContext(req.context, 'authRouter.tokens');
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
            const context = validateContext(req.context, 'authRouter.google');
            try {
                const redirectUrl = await authController.getGoogleAuthUrl(context);
                res.redirect(redirectUrl);
            } catch (err) {
                next(enrichError(err, context));
            }
        })
        .get('/google/callback', async (req, res, next) => {
            const context = validateContext(req.context, 'authRouter.googleCallback');
            try {
                const { code } = req.query;

                const googleUser = await authController.getGoogleUserProfile(context, code);
                const user = await userController.getOrCreateOAuthUser(context, googleUser.email, googleUser, AuthProvider.Google);
                const tokens = await authController.loginPrevalidatedUser(context, user);

                res.status(200).json({ user, tokens });
            } catch (err) {
                next(enrichError(err, context));
            }
        });
    return router;
};
