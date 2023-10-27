import { sendRequest } from '@/lib/api/sendRequest';
import { useCallback, useState } from 'react';

const useImage = () => {
    const [url, setUrl] = useState<string | undefined>();
    const [blob, setBlob] = useState<Blob | undefined>();
    const [isModified, setIsModified] = useState<boolean>(false);

    const init = async (initUrl: string | undefined) => {
        if (!initUrl) {
            return;
        }

        setUrl(initUrl);

        const { data, headers } = await sendRequest(`/api/proxy?url=${initUrl}`, 'GET', {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'image/*',
                'Allow-Cross-Origin-Resource-Sharing': '*'
            }
        });

        const blob = new Blob([data], { type: headers['content-type'] });

        setBlob(blob);
    };

    const validate = useCallback((): { update: Blob | undefined; isModified: boolean } => {
        return {
            update: blob,
            isModified
        };
    }, [blob, isModified]);

    const update = (update: Blob) => {
        setUrl(URL.createObjectURL(update));
        setBlob(update);
        setIsModified(true);
    };

    const remove = () => {
        setUrl(undefined);
        setBlob(undefined);
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
