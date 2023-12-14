import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/error/thymecardError';
import { IResourcePermissions, hasPermissions, permissions } from '../lib/auth/permissions';
import { ISessionService } from '../components/auth/session/session.service';
import { errorHandler } from '../lib/error/error.utils';
import { ErrorCode } from '@thymecard/types';

export const createAuthMiddleware = (sessionService: ISessionService, resourcePermissions: IResourcePermissions) => {
    return errorHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const context = req.context.getAnonContext();
        const resource = context.resource;
        const method = req.method;
        const route = context.route;
        const permissionsKey = `${method} ${route}`;

        const requiredPermissions = resourcePermissions[resource][permissionsKey];

        const isPublicRoute = requiredPermissions.length === 0;
        if (isPublicRoute) {
            return next();
        }

        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError(ErrorCode.MissingAccessToken, 'No access token was provided', {
                origin: 'authMiddleware.authenticate',
                data: { authHeader }
            });
        }

        const session = await sessionService.get(token);

        if (!session) {
            throw new UnauthorizedError(ErrorCode.InvalidAccessToken, 'Invalid access token', {
                origin: 'authMiddleware.authenticate',
                data: { token }
            });
        }

        const userPermissions = permissions[session.role];

        if (!hasPermissions(userPermissions, requiredPermissions)) {
            throw new ForbiddenError(ErrorCode.InsufficientPermissions, 'You do not have sufficient permissions to access this resource', {
                origin: 'authMiddleware.authenticate',
                data: { token, permissionsKey }
            });
        }

        if (route.includes(':userId')) {
            const userId = req.originalUrl.split('/')[route.split('/').indexOf(':userId')];
            if (userId !== session.userId) {
                throw new ForbiddenError(
                    ErrorCode.InsufficientPermissions,
                    'You do not have sufficient permissions to access this resource',
                    {
                        origin: 'authMiddleware.authenticate',
                        data: {
                            token,
                            permissionsKey,
                            userIdParam: userId,
                            userIdSession: session.userId
                        }
                    }
                );
            }
        }

        req.context.appendAuthData(session.userId.toString(), userPermissions);

        next();
    });
};

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
