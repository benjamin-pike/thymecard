import { useCallback, useState } from 'react';

const useRating = () => {
    const [initial, setInitial] = useState<number | undefined>(undefined);
    const [edit, setEdit] = useState<number | undefined>(undefined);

    const init = useCallback((rating: number | undefined) => {
        setInitial(rating);
        setEdit(rating);
    }, []);

    const validate = useCallback((): { value: number | undefined; isModified: boolean } => {
        return { value: edit, isModified: edit !== initial };
    }, [edit, initial]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            if (value === '') {
                return setEdit(undefined);
            }

            const parsedValue = parseFloat(value);

            if (parsedValue < 0 || parsedValue > 5 || parsedValue % 0.5 !== 0) {
                return setEdit(edit);
            }

            setEdit(parsedValue);
        },
        [edit]
    );

    return {
        edit,
        init,
        validate,
        handleChange
    };
};

export default useRating;
