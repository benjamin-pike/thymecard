import axios, { ResponseType } from 'axios';
import { getLocalStorageItem } from '../localStorage.utils';
import { isString } from '../type.utils';
import { Client, ErrorCode, Primative } from '@thymecard/types';
import { buildUrl } from '@thymecard/utils';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface IRequestOptions {
    body?: any;
    headers?: any;
    params?: Record<string, Primative>;
    query?: Record<string, Primative>;
    responseType?: ResponseType;
}

interface IResponse<RT, UseClient = true> {
    data: UseClient extends true ? Client<RT> : RT;
    status: number;
    headers?: any;
}

axios.interceptors.request.use(
    (config) => {
        if (config.url?.startsWith('/api/auth/')) {
            return config;
        }

        const token = getLocalStorageItem('session', isString);

        if (!token) {
            return config;
        }

        config.headers['Authorization'] = `Token ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export const sendRequest = async <RT = any, UseClient = true>(
    url: string,
    method: Method,
    options?: IRequestOptions
): Promise<IResponse<RT, UseClient>> => {
    const formattedUrl = buildUrl(url, {
        base: '/api',
        params: options?.params
    });

    try {
        const response = await axios({
            method,
            url: formattedUrl,
            data: options?.body,
            headers: options?.headers,
            params: options?.query,
            responseType: options?.responseType
        });

        const data = response.data as UseClient extends true ? Client<RT> : RT;

        return {
            data,
            status: response.status,
            headers: response.headers
        };
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            const { status, data, headers } = err.response;

            if (status === 500) {
                throw new Error('Oops! Something went wrong on our end. Please try again later.');
            }

            return {
                data,
                status,
                headers
            };
        }

        throw err;
    }
};

export const formatError = (error: any) => {
    return {
        status: error.response?.data?.status || 500,
        code: error.response?.data?.code || ErrorCode.InternalError,
        message: error.response?.data?.message || error.message,
        data: error.response?.data?.data || {}
    };
};
