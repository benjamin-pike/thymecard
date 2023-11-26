import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/error/thymecardError';
import { ErrorCode } from '../lib/error/errorCode';
import { isAccessTokenPayload } from '../components/auth/auth.types';
import { IResourcePermissions, hasPermissions } from '../lib/auth/permissions';

export const createAuthMiddleware = (accessTokenSecret: string, resourcePermissions: IResourcePermissions) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError(ErrorCode.MissingAccessToken, 'No access token was provided', {
                origin: 'authMiddleware.authenticate',
                data: { authHeader }
            });
        }

        let payload;
        try {
            payload = jwt.verify(token, accessTokenSecret);

            if (!isAccessTokenPayload(payload)) {
                throw new Error();
            }
        } catch (err) {
            throw new UnauthorizedError(ErrorCode.InvalidAccessToken, 'Invalid access token', {
                origin: 'authMiddleware.authenticate',
                data: { token }
            });
        }

        const context = req.context.getAnonContext()
        const resource = context.resource;
        const method = req.method;
        const route = context.route;
        const routeKey = `${method} ${route}`;

        const requiredPermissions = resourcePermissions[resource][routeKey];

        if (!requiredPermissions) {
            throw new UnauthorizedError(ErrorCode.MissingRoutePermissions, 'No permissions were defined for this route', {
                origin: 'authMiddleware.authenticate',
                data: { token, routeKey }
            });
        }

        if (!hasPermissions(payload.permissions, requiredPermissions)) {
            throw new ForbiddenError(ErrorCode.InsufficientPermissions, 'You do not have sufficient permissions to access this resource', {
                origin: 'authMiddleware.authenticate',
                data: { token, routeKey }
            });
        }

        if (route.includes(':userId')) {
            const userId = req.originalUrl.split('/')[route.split('/').indexOf(':userId')];
            if (userId !== payload.userId) {
                throw new ForbiddenError(ErrorCode.InsufficientPermissions, 'You do not have sufficient permissions to access this resource', {
                    origin: 'authMiddleware.authenticate',
                    data: {
                        token,
                        routeKey,
                        userIdParam: userId,
                        userIdToken: payload.userId
                    }
                });
            }
        }

        req.context.appendAuthData(payload.userId, payload.permissions);

        next();
    };
};

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;