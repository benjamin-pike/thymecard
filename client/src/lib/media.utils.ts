import { isValidUrl } from '@thymecard/types';

export const validateImageUrl = (url: string) => {
    if (!isValidUrl(url)) {
        return false;
    }

    const img = new Image();
    img.src = url;

    return img.complete;
};
