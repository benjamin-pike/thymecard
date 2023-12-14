import axios, { ResponseType } from 'axios';
import { getLocalStorageItem } from '../localStorage.utils';
import { isString } from '../type.utils';
import { ErrorCode } from '@thymecard/types';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface IRequestOptions {
    body?: any;
    headers?: any;
    query?: any;
    responseType?: ResponseType;
}

interface IResponse {
    status: number;
    data: any;
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

export const sendRequest = async (url: string, method: Method, options?: IRequestOptions): Promise<IResponse> => {
    const response = await axios({
        method,
        url,
        data: options?.body,
        headers: options?.headers,
        params: options?.query,
        responseType: options?.responseType
    });

    return {
        status: response.status,
        data: response.data,
        headers: response.headers
    };
};

export const formatError = (error: any) => {
    return {
        status: error.response?.data?.status || 500,
        code: error.response?.data?.code || ErrorCode.InternalError,
        message: error.response?.data?.message || error.message,
        data: error.response?.data?.data || {}
    };
};
