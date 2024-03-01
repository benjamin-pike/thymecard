import { useCallback, useState } from 'react';
import { IRecipeNutritionalInformation } from '@thymecard/types';
import { compare } from '@thymecard/utils';

const useNutrition = () => {
    const [initial, setInitial] = useState<IRecipeNutritionalInformation>({});
    const [edit, setEdit] = useState<IRecipeNutritionalInformation>({});

    const init = useCallback((nutrition: IRecipeNutritionalInformation | undefined) => {
        setInitial({ ...nutrition });
        setEdit({ ...nutrition });
    }, []);

    const validate = useCallback((): { value: IRecipeNutritionalInformation; isModified: boolean } => {
        return {
            value: edit,
            isModified: !compare(edit, initial)
        };
    }, [edit, initial]);

    const handleChange = useCallback(
        (field: 'calories' | 'carbohydrate' | 'protein' | 'fat') => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.value.length) {
                setEdit({ ...edit, [field]: undefined });
                return;
            }

            const value = parseFloat(e.target.value);

            if (isNaN(value) || value < 0 || value > 9999) {
                setEdit({ ...edit });
                return;
            }

            setEdit({ ...edit, [field]: value });
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

export default useNutrition;
