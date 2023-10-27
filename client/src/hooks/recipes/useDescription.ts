import { useCallback, useState } from 'react';

const useDescription = () => {
    const [initial, setInitial] = useState<string | undefined>(undefined);
    const [edit, setEdit] = useState<string | undefined>(undefined);

    const init = useCallback((description: string | undefined) => {
        console.log('init description', description);
        setInitial(description);
        setEdit(description);
    }, []);

    const validate = useCallback((): { update: string | undefined; isModified: boolean } => {
        const isModified = initial !== edit;

        return { update: edit, isModified };
    }, [edit, initial]);

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!e.target.value) {
            return setEdit(undefined);
        }

        setEdit(e.target.value);
    }, []);

    return { edit, init, validate, handleDescriptionChange };
};

export default useDescription;
