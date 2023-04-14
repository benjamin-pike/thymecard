import HttpCode from 'http-status-enum';
import { ErrorCode } from './errorCode';
import { ILog, ILogError } from '../types/logger.types';

type ErrorLogBody = Omit<ILog, 'message' | 'httpCode'>;

interface ISironaError extends Error {
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

export class SironaError implements ISironaError {
    name: string;
    message: string;
    internalCode: ErrorCode;
    httpCode: HttpCode;
    logBody: ErrorLogBody;

    constructor(internalCode: ErrorCode, message: string, httpCode: HttpCode, logBody: ErrorLogBody) {
        this.name = 'SironaError';
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

    public enrich(enrichment: Omit<ErrorLogBody, 'origin'>): SironaError {
        this.logBody = {
            ...enrichment,
            ...this.logBody
        };

        return this;
    }
}

export class BadRequestError extends SironaError {
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Bad Request', HttpCode.BAD_REQUEST, logBody);
    }
}

export class ConflictError extends SironaError {
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Conflict', HttpCode.CONFLICT, logBody);
    }
}

export class UnprocessableError extends SironaError {
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Unprocessable Entity', HttpCode.UNPROCESSABLE_ENTITY, logBody);
    }
}

export class NotFoundError extends SironaError {
    constructor(internalCode: ErrorCode, message: string | undefined, logBody: ErrorLogBody) {
        super(internalCode, message ?? 'Not Found', HttpCode.NOT_FOUND, logBody);
    }
}
