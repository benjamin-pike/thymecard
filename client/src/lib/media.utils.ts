import { sendRequest } from './api/sendRequest';
import { isValidUrl } from '@thymecard/types';
import { ROUTES } from '@/api/routes';

export const validateImageUrl = (url: string) => {
    return new Promise((resolve, reject) => {
        if (!isValidUrl(url)) {
            reject(false);
            return;
        }

        const img = new Image();

        img.onload = () => resolve(true);
        img.onerror = () => reject(false);

        img.src = url;
    });
};

export const imageUrlToBlob = async (url: string) => {
    const { data, headers } = await sendRequest<ArrayBuffer, false>(ROUTES.PROXY, 'GET', {
        responseType: 'arraybuffer',
        headers: {
            Accept: 'image/*',
            'Allow-Cross-Origin-Resource-Sharing': '*'
        },
        query: {
            url
        }
    });

    const blob = new Blob([data], { type: headers['content-type'] });

    return blob;
};
