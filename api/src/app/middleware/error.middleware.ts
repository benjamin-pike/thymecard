import { Request, Response, NextFunction } from 'express';
import HttpCode from 'http-status-enum';
import { ErrorCode } from '../lib/error/errorCode';
import { SironaError, standardizeErrorCode } from '../lib/error/sironaError';
import { logger } from '../common/logger';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof SironaError) {
        logger.error(err.toLog());
        return res.status(err.httpCode).json(err.toResponseBody());
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        code: standardizeErrorCode(ErrorCode.InternalServerError),
        message: err.message
    });
};
