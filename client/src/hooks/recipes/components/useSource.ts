import { useCallback, useState } from 'react';
import { createToast } from '@/lib/toast/toast.utils';
import { isValidUrl } from '@thymecard/types';

const useSource = () => {
    const [initial, setInitial] = useState<string | null>(null);
    const [edit, setEdit] = useState<string | null>(null);

    const init = useCallback((description: string | null) => {
        setInitial(description);
        setEdit(description);
    }, []);

    const validate = useCallback((): { value: string | null; isModified: boolean } => {
        if (edit && !isValidUrl(edit)) {
            createToast('error', 'Invalid recipe source URL');
            throw new Error('Invalid recipe source URL');
        }

        const isModified = initial !== edit;

        return { value: edit, isModified };
    }, [edit, initial]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            return setEdit(null);
        }

        setEdit(e.target.value);
    }, []);

    return { edit, init, validate, handleChange };
};

export default useSource;
