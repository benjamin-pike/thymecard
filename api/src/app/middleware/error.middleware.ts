import { Request, Response, NextFunction } from 'express';
import HttpCode from 'http-status-enum';
import { ThymecardError } from '../lib/error/thymecardError';
import { ErrorCode } from '@thymecard/types';
import { logger } from '../common/logger';
import { standardizeErrorCode } from '@thymecard/utils';

export const errorsMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ThymecardError) {
        logger.error(err.toLog());
        return res.status(err.httpCode).json(err.toResponseBody());
    }
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        code: standardizeErrorCode(ErrorCode.InternalError),
        message: err.message
    });
};

export type ErrorsMiddleware = typeof errorsMiddleware;
