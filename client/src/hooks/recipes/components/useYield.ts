import { useCallback, useState } from 'react';
import { createToast } from '@/lib/toast/toast.utils';
import { IRecipeYield, isNumber } from '@thymecard/types';

interface IRecipeYieldEdit {
    quantity: string;
    units: string | undefined;
}

const useYield = () => {
    const [initial, setInitial] = useState<IRecipeYieldEdit>({ quantity: '', units: '' });
    const [edit, setEdit] = useState<IRecipeYieldEdit>({ quantity: '', units: '' });

    const init = useCallback((recipeYield: IRecipeYield) => {
        if (!recipeYield) {
            setInitial({ quantity: '', units: '' });
            setEdit({ quantity: '', units: '' });
            return;
        }

        const { quantity, units } = recipeYield;

        setInitial({ quantity: quantity.join(' - '), units: units ?? undefined });
        setEdit({ quantity: quantity.join(' - '), units: units ?? undefined });
    }, []);

    const validate = useCallback((): { value: IRecipeYield; isModified: boolean } => {
        const quantities = edit.quantity.split('-').map((q) => parseFloat(q));

        if (quantities.some((q) => !q || !isNumber(q))) {
            createToast('error', 'Invalid yield quantity');
            throw new Error('Invalid yield quantity');
        }

        const isModified = initial.quantity.toString() !== edit.quantity.toString() || initial.units !== edit.units;

        const value = {
            quantity: quantities,
            units: edit.units ?? null
        };

        return { value, isModified };
    }, [edit, initial]);

    const handleQuantityBlur = useCallback(
        (e: React.ChangeEvent<HTMLParagraphElement>) => {
            const value = e.target.innerText;
            const validCharsRegex = /^[1234567890. -]*$/;

            if (!validCharsRegex.test(value)) {
                e.target.innerText = edit.quantity;
                setEdit(edit);
                return;
            }

            setEdit({ ...edit, quantity: value });
        },
        [edit]
    );

    const handleUnitsChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            if (!value) {
                return setEdit({ ...edit, units: undefined });
            }

            setEdit({ ...edit, units: value });
        },
        [edit]
    );

    return { edit, init, validate, handleQuantityBlur, handleUnitsChange };
};

export default useYield;
