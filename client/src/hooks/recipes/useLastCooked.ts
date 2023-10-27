import { useCallback, useState } from 'react';
import { DateTime } from 'luxon';

const useLastCooked = () => {
    const [initial, setInitial] = useState<DateTime | undefined>(undefined);
    const [edit, setEdit] = useState<DateTime | undefined>(undefined);

    const init = useCallback((lastCooked: string | undefined) => {
        setInitial(lastCooked ? DateTime.fromISO(lastCooked) : undefined);
        setEdit(lastCooked ? DateTime.fromISO(lastCooked) : undefined);
    }, []);

    const validate = useCallback((): { update: string | undefined; isModified: boolean } => {
        const update = edit?.toISO() ?? undefined;
        const isModified = edit?.toString() !== initial?.toString();

        return { update, isModified };
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
