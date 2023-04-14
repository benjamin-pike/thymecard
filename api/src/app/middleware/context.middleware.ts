import { Request, Response, NextFunction } from 'express';
import { logger } from '../common/logger';
import { v1 as uuid } from 'uuid';
import { isDefined, isString, validateWithError, validateWithFallback } from '../lib/types/types.utils';
import { Logger } from 'winston';
import { BadRequestError } from '../lib/error/sironaError';
import { ErrorCode } from '../lib/error/errorCode';

export interface IRequestContext {
    requestId: string;
    url: string;
    logger: Logger;
}

export const isRequestContext = (obj: any): obj is IRequestContext => {
    return isDefined(obj) && isString(obj.requestId) && isDefined(obj.logger);
};

export const validateContext = (context: unknown, origin: string): IRequestContext => {
    return validateWithError(
        isRequestContext,
        context,
        new BadRequestError(ErrorCode.InvalidContext, 'Invalid context', {
            origin
        })
    );
};

export const addCallContext = (req: Request, _res: Response, next: NextFunction): void => {
    const requestId = validateWithFallback(isString, req.headers['x-sirona-request-id'], uuid());

    req.context = {
        requestId: requestId,
        url: req.originalUrl,
        logger: logger.child({ requestId })
    };

    next();
};
