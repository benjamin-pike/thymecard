import { useCallback, useState } from 'react';
import { compare } from '@thymecard/utils';

const useAuthors = () => {
    const [initial, setInitial] = useState<string[]>([]);
    const [edit, setEdit] = useState<string[]>([]);

    const init = useCallback((authors: string[]) => {
        setInitial(authors);
        setEdit(authors);
    }, []);

    const validate = useCallback((): { value: string[]; isModified: boolean } => {
        const isModified = !compare(initial, edit);

        return { value: edit?.filter((author) => author), isModified };
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
            setEdit(edit?.filter((_, i) => i !== index));
        },
        [edit]
    );

    return { edit, init, validate, handleAdd, handleBlur, handleDelete };
};

export default useAuthors;
