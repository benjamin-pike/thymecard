import { useCallback, useState } from 'react';

const useDescription = () => {
    const [initial, setInitial] = useState<string | null>(null);
    const [edit, setEdit] = useState<string | null>(null);

    const init = useCallback((description: string | null) => {
        setInitial(description);
        setEdit(description);
    }, []);

    const validate = useCallback((): { value: string | null; isModified: boolean } => {
        const isModified = initial !== edit;

        return { value: edit, isModified };
    }, [edit, initial]);

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!e.target.value) {
            return setEdit(null);
        }

        setEdit(e.target.value);
    }, []);

    return { edit, init, validate, handleDescriptionChange };
};

export default useDescription;
