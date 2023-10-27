import { useCallback, useState } from 'react';

interface ITime {
    hours?: number;
    minutes?: number;
}

interface ITimeEdit {
    prep: ITime | undefined;
    cook: ITime | undefined;
    total: ITime | undefined;
}

interface IValidate {
    update: number | undefined;
    isModified: boolean;
}

const useTime = () => {
    const [initial, setInitial] = useState<ITimeEdit>({ prep: undefined, cook: undefined, total: undefined });
    const [edit, setEdit] = useState<ITimeEdit>({ prep: undefined, cook: undefined, total: undefined });

    const init = useCallback((prep: number | undefined, cook: number | undefined, total: number | undefined) => {
        setInitial({ prep: minutesToHoursAndMinutes(prep), cook: minutesToHoursAndMinutes(cook), total: minutesToHoursAndMinutes(total) });
        setEdit({ prep: minutesToHoursAndMinutes(prep), cook: minutesToHoursAndMinutes(cook), total: minutesToHoursAndMinutes(total) });
    }, []);

    const validate = useCallback((): {
        prep: IValidate;
        cook: IValidate;
        total: IValidate;
    } => {
        const update = {
            prep: (edit.prep?.hours ?? 0) * 60 + (edit.prep?.minutes ?? 0) || undefined,
            cook: (edit.cook?.hours ?? 0) * 60 + (edit.cook?.minutes ?? 0) || undefined,
            total: (edit.total?.hours ?? 0) * 60 + (edit.total?.minutes ?? 0) || undefined
        };

        return {
            prep: { update: update.prep, isModified: edit.prep?.toString() !== initial.prep?.toString() },
            cook: { update: update.cook, isModified: edit.cook?.toString() !== initial.cook?.toString() },
            total: { update: update.total, isModified: edit.total?.toString() !== initial.total?.toString() }
        };
    }, [edit, initial]);

    const handleHoursChange = useCallback(
        (field: 'prep' | 'cook' | 'total') => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.value) {
                setEdit({ ...edit, [field]: { ...edit[field], hours: undefined } });
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
                setEdit({ ...edit, [field]: { ...edit[field], minutes: undefined } });
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

const minutesToHoursAndMinutes = (mins: number | undefined): ITime => {
    if (!mins) {
        return { hours: undefined, minutes: undefined };
    }

    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    return { hours, minutes };
};
