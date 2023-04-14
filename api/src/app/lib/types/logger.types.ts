import { Request } from 'express';
import httpCode from 'http-status-enum';

export interface ILog {
    origin: string;
    message: string;
    url?: string;
    httpCode?: httpCode;
    requestId?: string;
    headers?: Request['headers'];
    params?: Request['params'];
    query?: Request['query'];
    body?: any;
    data?: any;
}

export interface ILogError extends ILog {
    internalCode: string;
}
