import { useCallback, useState } from 'react';
import { sendRequest } from '@/lib/api/sendRequest';
import { ROUTES } from '@/api/routes';

const useImage = () => {
    const [url, setUrl] = useState<string | null>(null);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [isModified, setIsModified] = useState<boolean>(false);

    const init = async (source: string | null) => {
        setUrl(source);

        if (!source) {
            setBlob(null);

            return;
        }

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

        setBlob(blob);
    };

    const validate = useCallback((): { value: Blob | null; isModified: boolean } => {
        return {
            value: blob,
            isModified
        };
    }, [blob, isModified]);

    const update = (update: Blob) => {
        setUrl(URL.createObjectURL(update));
        setBlob(update);
        setIsModified(true);
    };

    const remove = () => {
        setUrl(null);
        setBlob(null);
    };

    return {
        url,
        blob,
        init,
        validate,
        update,
        remove
    };
};

export default useImage;
