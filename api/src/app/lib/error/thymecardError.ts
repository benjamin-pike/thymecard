import HttpCode from 'http-status-enum';
import { ErrorCode } from './errorCode';
import { ILog, ILogError } from '../types/logger.types';

type ErrorLogBody = Omit<ILog, 'message' | 'httpCode'>;

interface IThymecardError extends Error {
    message: string;
    internalCode: ErrorCode;
    httpCode: HttpCode;
    logBody: ErrorLogBody;
    toResponseBody(): IErrorResponse;
}

interface IErrorResponse {
    code: string;
    status: HttpCode;
    message: string;
}

export const standardizeErrorCode = (code: number) => {
    return `E-${code.toString().padStart(4, '0')}`;
};

export class ThymecardError implements IThymecardError {
    name: string;
    message: string;
    internalCode: ErrorCode;
    httpCode: HttpCode;
    logBody: ErrorLogBody;

    constructor(internalCode: ErrorCode, message: string, httpCode: HttpCode, logBody: ErrorLogBody) {
        this.name = 'ThymecardError';
        this.message = message;
        this.internalCode = internalCode;
        this.httpCode = httpCode;
        this.logBody = logBody;
    }

    public toResponseBody(): IErrorResponse {
        return {
            status: this.httpCode,
            code: standardizeErrorCode(this.internalCode),
            message: this.message
        };
    }

    public toLog(): ILogError {
        return {
            message: this.message,
            internalCode: standardizeErrorCode(this.internalCode),
            httpCode: this.httpCode,
            ...this.logBody
        };
    }

    public enrich(enrichment: Omit<ErrorLogBody, 'origin'>): ThymecardError {
        this.logBody = {
            ...enrichment,
            ...this.logBody
        };

        return this;
    }
}

export class BadRequestError extends ThymecardError { // 400
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Bad Request', HttpCode.BAD_REQUEST, logBody);
    }
}

export class UnauthorizedError extends ThymecardError { // 401
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Unauthorized', HttpCode.UNAUTHORIZED, logBody);
    }
}

export class ForbiddenError extends ThymecardError { // 403
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Forbidden', HttpCode.FORBIDDEN, logBody);
    }
}

export class NotFoundError extends ThymecardError { // 404
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Not Found', HttpCode.NOT_FOUND, logBody);
    }
}

export class MethodNotAllowedError extends ThymecardError { // 405
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Method Not Allowed', HttpCode.METHOD_NOT_ALLOWED, logBody);
    }
}

export class ConflictError extends ThymecardError { // 409
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Conflict', HttpCode.CONFLICT, logBody);
    }
}

export class UnprocessableError extends ThymecardError { // 422
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Unprocessable Entity', HttpCode.UNPROCESSABLE_ENTITY, logBody);
    }
}

export class TooManyRequestsError extends ThymecardError { // 429
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Too Many Requests', HttpCode.TOO_MANY_REQUESTS, logBody);
    }
}

export class InternalError extends ThymecardError { // 500
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Internal Server Error', HttpCode.INTERNAL_SERVER_ERROR, logBody);
    }
}

export class BadGatewayError extends ThymecardError { // 502
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Bad Gateway', HttpCode.BAD_GATEWAY, logBody);
    }
}