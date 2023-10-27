import axios, { ResponseType } from 'axios';
import { getLocalStorageItem, setLocalStorageItem } from '../localStorage.utils';
import { isString } from '../type.utils';

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

        const token = getLocalStorageItem('accessToken', isString);

        if (!token) {
            return config;
        }

        config.headers['Authorization'] = `Bearer ${token}`;
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
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest.url.startsWith('/api/auth/')) {
            try {
                const token = getLocalStorageItem('refreshToken', isString);

                if (!token) {
                    throw new Error('No refresh token found');
                }

                const { status, data } = await sendRequest('/api/auth/tokens', 'GET', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (status !== 200 || !data) {
                    throw new Error('Invalid response from server');
                }

                const { accessToken, refreshToken } = data.tokens;

                if (!isString(accessToken)) {
                    throw new Error('Server returned an invalid payload');
                }

                setLocalStorageItem('accessToken', accessToken, isString);
                setLocalStorageItem('refreshToken', refreshToken, isString);

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return axios(originalRequest);
            } catch (err) {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export const sendRequest = async (url: string, method: Method, options?: IRequestOptions): Promise<IResponse> => {
    try {
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
    } catch (err) {
        console.error(err);
        return {
            status: 500,
            data: null,
            headers: null
        };
    }
};
