import { useCallback, useState } from 'react';
import { DateTime } from 'luxon';

const useLastCooked = () => {
    const [initial, setInitial] = useState<DateTime | null>(null);
    const [edit, setEdit] = useState<DateTime | null>(null);

    const init = useCallback((lastCooked: string | null) => {
        setInitial(lastCooked ? DateTime.fromISO(lastCooked) : null);
        setEdit(lastCooked ? DateTime.fromISO(lastCooked) : null);
    }, []);

    const validate = useCallback((): { value: string | null; isModified: boolean } => {
        const value = edit?.toISO() ?? null;
        const isModified = edit?.toString() !== initial?.toString();

        return { value, isModified };
    }, [edit, initial]);

    const handleSelect = useCallback((day: DateTime) => {
        setEdit(day);
    }, []);

    return {
        edit,
        init,
        validate,
        handleSelect
    };
};

export default useLastCooked;
