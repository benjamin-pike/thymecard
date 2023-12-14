import HttpCode from 'http-status-enum';
import { ILog, ILogError } from '../types/logger.types';
import { ErrorCode } from '@thymecard/types';
import { standardizeErrorCode } from '@thymecard/utils';

type ErrorLogData = Omit<ILog, 'message' | 'httpCode'>;

interface IThymecardError extends Error {
    message: string;
    internalCode: ErrorCode;
    httpCode: HttpCode;
    logData: ErrorLogData;
    toResponseBody(): IErrorResponse;
}

interface IErrorResponse {
    code: string;
    status: HttpCode;
    message: string;
    data?: Record<string, any>;
}

export class ThymecardError implements IThymecardError {
    name: string;
    message: string;
    internalCode: ErrorCode;
    httpCode: HttpCode;
    logData: ErrorLogData;
    resData?: Record<string, any>;

    constructor(internalCode: ErrorCode, message: string, httpCode: HttpCode, logData: ErrorLogData, resData?: Record<string, any>) {
        this.name = 'ThymecardError';
        this.message = message;
        this.internalCode = internalCode;
        this.httpCode = httpCode;
        this.logData = logData;
        this.resData = resData;
    }

    public toResponseBody(): IErrorResponse {
        return {
            status: this.httpCode,
            code: standardizeErrorCode(this.internalCode),
            message: this.message,
            data: this.resData
        };
    }

    public toLog(): ILogError {
        return {
            message: this.message,
            internalCode: standardizeErrorCode(this.internalCode),
            httpCode: this.httpCode,
            ...this.logData
        };
    }

    public enrich(enrichment: Omit<ErrorLogData, 'origin'>): ThymecardError {
        this.logData = {
            ...enrichment,
            ...this.logData
        };

        return this;
    }
}

export class BadRequestError extends ThymecardError {
    // 400
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Bad Request', HttpCode.BAD_REQUEST, logData, resData);
    }
}

export class UnauthorizedError extends ThymecardError {
    // 401
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Unauthorized', HttpCode.UNAUTHORIZED, logData, resData);
    }
}

export class ForbiddenError extends ThymecardError {
    // 403
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Forbidden', HttpCode.FORBIDDEN, logData, resData);
    }
}

export class NotFoundError extends ThymecardError {
    // 404
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Not Found', HttpCode.NOT_FOUND, logData, resData);
    }
}

export class MethodNotAllowedError extends ThymecardError {
    // 405
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Method Not Allowed', HttpCode.METHOD_NOT_ALLOWED, logData, resData);
    }
}

export class ConflictError extends ThymecardError {
    // 409
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Conflict', HttpCode.CONFLICT, logData, resData);
    }
}

export class UnprocessableError extends ThymecardError {
    // 422
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Unprocessable Entity', HttpCode.UNPROCESSABLE_ENTITY, logData, resData);
    }
}

export class TooManyRequestsError extends ThymecardError {
    // 429
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Too Many Requests', HttpCode.TOO_MANY_REQUESTS, logData, resData);
    }
}

export class InternalError extends ThymecardError {
    // 500
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Internal Server Error', HttpCode.INTERNAL_SERVER_ERROR, logData, resData);
    }
}

export class BadGatewayError extends ThymecardError {
    // 502
    constructor(internalCode: ErrorCode, message: string | undefined, logData: ErrorLogData, resData?: Record<string, any>) {
        super(internalCode, message ?? 'Bad Gateway', HttpCode.BAD_GATEWAY, logData, resData);
    }
}
