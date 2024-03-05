import { compare } from '@thymecard/utils';
import { useCallback, useState } from 'react';

interface ITime {
    hours: number | null;
    minutes: number | null;
}

interface ITimeEdit {
    prep: ITime | null;
    cook: ITime | null;
    total: ITime | null;
}

interface IValidate {
    value: number | null;
    isModified: boolean;
}

const useTime = () => {
    const [initial, setInitial] = useState<ITimeEdit>({ prep: null, cook: null, total: null });
    const [edit, setEdit] = useState<ITimeEdit>({ prep: null, cook: null, total: null });

    const init = useCallback((prep: number | null, cook: number | null, total: number | null) => {
        console.log('init time');
        setInitial({
            prep: minutesToHoursAndMinutes(prep),
            cook: minutesToHoursAndMinutes(cook),
            total: minutesToHoursAndMinutes(total)
        });
        setEdit({
            prep: minutesToHoursAndMinutes(prep),
            cook: minutesToHoursAndMinutes(cook),
            total: minutesToHoursAndMinutes(total)
        });
    }, []);

    const validate = useCallback((): {
        prep: IValidate;
        cook: IValidate;
        total: IValidate;
    } => {
        const value = {
            prep: (edit.prep?.hours ?? 0) * 60 + (edit.prep?.minutes ?? 0) || null,
            cook: (edit.cook?.hours ?? 0) * 60 + (edit.cook?.minutes ?? 0) || null,
            total: (edit.total?.hours ?? 0) * 60 + (edit.total?.minutes ?? 0) || null
        };

        return {
            prep: { value: value.prep, isModified: !compare(edit.prep, initial.prep) },
            cook: { value: value.cook, isModified: !compare(edit.cook, initial.cook) },
            total: { value: value.total, isModified: !compare(edit.total, initial.total) }
        };
    }, [edit, initial]);

    const handleHoursChange = useCallback(
        (field: 'prep' | 'cook' | 'total') => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.value) {
                setEdit({ ...edit, [field]: { ...edit[field], hours: null } });
                return;
            }

            const value = parseInt(e.target.value);

            if (isNaN(value) || value < 1 || value > 99) {
                setEdit({ ...edit });
                return;
            }

            setEdit({ ...edit, [field]: { ...edit[field], hours: value } });
        },
        [edit]
    );

    const handleMinutesChange = useCallback(
        (field: 'prep' | 'cook' | 'total') => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.value) {
                setEdit({ ...edit, [field]: { ...edit[field], minutes: null } });
                return;
            }

            const value = parseInt(e.target.value);

            if (isNaN(value) || value < 1 || value > 59) {
                setEdit({ ...edit });
                return;
            }

            setEdit({ ...edit, [field]: { ...edit[field], minutes: value } });
        },
        [edit]
    );

    return { edit, init, validate, handleHoursChange, handleMinutesChange };
};

export default useTime;

const minutesToHoursAndMinutes = (mins: number | null): ITime => {
    if (!mins) {
        return { hours: null, minutes: null };
    }

    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    return { hours, minutes };
};
