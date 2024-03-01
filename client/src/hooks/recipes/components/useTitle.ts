import { useCallback, useState } from 'react';
import { createToast } from '@/lib/toast/toast.utils';

const useTitle = () => {
    const [initial, setInitial] = useState('');
    const [edit, setEdit] = useState('');

    const init = useCallback((title: string | undefined) => {
        if (!title) {
            setInitial('');
            setEdit('');
            return;
        }

        setInitial(title);
        setEdit(title);
    }, []);

    const validate = (): { value: string; isModified: boolean } => {
        if (!edit.length) {
            createToast('error', 'A recipe title is required');
            throw new Error('A title is required');
        }

        const isModified = initial !== edit;

        return { value: edit, isModified };
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(e.target.value);
    };

    return { edit, init, validate, handleTitleChange };
};

export default useTitle;
