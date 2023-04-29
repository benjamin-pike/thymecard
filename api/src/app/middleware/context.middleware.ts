import { Request, Response, NextFunction } from 'express';
import { logger } from '../common/logger';
import { v1 as uuid } from 'uuid';
import { isDefined, isNumber, isRecord, isString, validateWithError, validateWithFallback } from '../lib/types/types.utils';
import { Logger } from 'winston';
import { ForbiddenError, NotFoundError } from '../lib/error/sironaError';
import { ErrorCode } from '../lib/error/errorCode';
import { IResourcePermissions } from '../lib/auth/permissions';

export interface IRequestContext {
    requestId: string;
    resource: string;
    route: string;
    deviceId: string;
    logger: Logger;
}

export interface IAuthenticatedContext extends IRequestContext {
    userId: string;
    permissions: Record<string, number>;
}

export const createContextMiddleware = (nodeEnv: string, resourcePermissions: IResourcePermissions) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const requestContext = new RequestContext(req, res, nodeEnv, resourcePermissions);
        req.context = requestContext;
        next();
    };
};

export type ContextMiddleware = ReturnType<typeof createContextMiddleware>;

export class RequestContext {
    private readonly req: Request;
    private readonly res: Response;
    private readonly nodeEnv: string;
    private readonly resourcePermissions: IResourcePermissions;

    private requestId: string;
    private route: string;
    private deviceId: string;
    private resource: string;
    private logger: Logger = logger;
    private userId?: string;
    private permissions?: Record<string, number>;

    constructor(req: Request, res: Response, nodeEnv: string, resourcePermissions: IResourcePermissions) {
        this.req = req;
        this.res = res;
        this.nodeEnv = nodeEnv;
        this.resourcePermissions = resourcePermissions;

        this.requestId = this.setRequestId();
        this.deviceId = this.setDeviceId();
        this.resource = this.setResource();
        this.route = this.setRoute();
    }

    private setRequestId(): string {
        return validateWithFallback(this.req.headers['x-sirona-request-id'], isString, uuid());
    }

    private setDeviceId(): string {
        let deviceId = this.req.cookies.deviceId;

        if (!deviceId) {
            deviceId = uuid();
            this.res.cookie('deviceId', deviceId, {
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                secure: this.nodeEnv === 'production',
                sameSite: 'strict'
            });
        }

        return deviceId;
    }

    private setResource(): string {
        return this.req.originalUrl.split('/')[1];
    }

    private setRoute(): string {
        const resourceRoutes = this.resourcePermissions[this.resource];

        if (!resourceRoutes) {
            throw new NotFoundError(ErrorCode.RouteNotFound, 'Route not found', {
                origin: 'routes.matchPredefinedRoutePattern',
                data: { method: this.req.method, path: this.req.path }
            });
        }

        const candidateRoutes: string[] = Object.keys(resourceRoutes);
        const matchedRoute = candidateRoutes.find((route) => {
            const [routeMethod, routePath] = route.split(' ');

            return this.isMatchingRoute(this.req.method, this.req.path, routeMethod, routePath);
        });

        if (!matchedRoute) {
            throw new NotFoundError(ErrorCode.RouteNotFound, 'Route not found', {
                origin: 'routes.matchPredefinedRoutePattern',
                data: { method: this.req.method, path: this.req.path }
            });
        }

        return matchedRoute.split(' ')[1];
    }

    public appendAuthData = (userId: string, permissions: Record<string, number>): void => {
        this.userId = userId;
        this.permissions = permissions;
    };

    private isMatchingRoute(reqMethod: string, reqPath: string, candidateMethod: string, candidatePath: string): boolean {
        if (reqMethod.toLowerCase() !== candidateMethod.toLowerCase()) {
            return false;
        }

        const splitReqPath = reqPath.split('/');
        const splitCandidatePath = candidatePath.split('/');

        if (splitReqPath.length !== splitCandidatePath.length) {
            return false;
        }

        return splitCandidatePath.every((routePart, i) => routePart.startsWith(':') || routePart === splitReqPath[i]);
    }

    public validateContext (origin: string): IRequestContext {
        const context = {
            requestId: this.requestId,
            resource: this.resource,
            route: this.route,
            deviceId: this.deviceId,
            logger: this.logger
        }

        return validateWithError(
            context,
            isRequestContext,
            new ForbiddenError(ErrorCode.InvalidContext, 'Invalid context', {
                origin,
                data: { context: this }
            })
        );
    };
    
    public validateAuthContext (origin: string): IAuthenticatedContext {
        const context = {
            requestId: this.requestId,
            resource: this.resource,
            route: this.route,
            deviceId: this.deviceId,
            logger: this.logger,
            userId: this.userId,
            permissions: this.permissions
        }

        return validateWithError(
            context,
            isAuthenticatedContext,
            new ForbiddenError(ErrorCode.InvalidContext, 'Invalid context', {
                origin,
                data: { context }
            })
        );
    };
}

const isRequestContext = (obj: any): obj is IRequestContext => {
    return (
        obj && isString(obj.requestId) && isString(obj.resource) && isString(obj.route) && isString(obj.deviceId) && isDefined(obj.logger)
    );
};

const isAuthenticatedContext = (obj: any): obj is IAuthenticatedContext => {
    return isString(obj.userId) && isRecord(obj.permissions, isNumber) && isRequestContext(obj);
};