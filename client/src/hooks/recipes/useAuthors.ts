import { useCallback, useState } from 'react';

const useAuthors = () => {
    const [initial, setInitial] = useState<string[] | undefined>(undefined);
    const [edit, setEdit] = useState<string[] | undefined>(undefined);

    const init = useCallback((authors: string[] | undefined) => {
        setInitial(authors);
        setEdit(authors);
    }, []);

    const validate = useCallback((): { update: string[] | undefined; isModified: boolean } => {
        const isModified = initial !== edit;

        return { update: edit?.filter((author) => author), isModified };
    }, [edit, initial]);

    const handleAdd = useCallback(() => {
        setEdit([...(edit ?? []), '']);
    }, [edit]);

    const handleBlur = useCallback(
        (index: number) => (e: React.ChangeEvent<HTMLParagraphElement>) => {
            setEdit(edit?.map((author, i) => (i === index ? e.target.innerText : author)));
        },
        [edit]
    );

    const handleDelete = useCallback(
        (index: number) => () => {
            if (edit?.length === 1) {
                return setEdit(undefined);
            }

            setEdit(edit?.filter((_, i) => i !== index));
        },
        [edit]
    );

    return { edit, init, validate, handleAdd, handleBlur, handleDelete };
};

export default useAuthors;
