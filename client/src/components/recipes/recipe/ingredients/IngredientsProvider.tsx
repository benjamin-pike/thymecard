import { createContext, useState, useContext, FC, ReactElement, SetStateAction, Dispatch, useCallback } from 'react';
import { IIngredient } from  '@/types/recipe.types';
import { isArrayOf, isString } from '@/lib/type.utils';
import { createToast } from '@/lib/toast/toast.utils';

interface IIngredientsContext {
    ingredients: IIngredient[];
    quantityValues: (number | null)[];
    unitValues: (string | null)[];
    itemValues: (string | null)[];
    prepStyleValues: (string | null)[];
    noteValues: (string | null)[];
    setIngredients: Dispatch<SetStateAction<IIngredient[]>>;
    setQuantityValues: Dispatch<SetStateAction<(number | null)[]>>;
    setUnitValues: Dispatch<SetStateAction<(string | null)[]>>;
    setItemValues: Dispatch<SetStateAction<(string | null)[]>>;
    setPrepStyleValues: Dispatch<SetStateAction<(string | null)[]>>;
    setNoteValues: Dispatch<SetStateAction<(string | null)[]>>;
    saveIngredients: () => void;
    validateIngredients: () => boolean;
}

const IngredientsContext = createContext<IIngredientsContext | null>(null);
const { Provider } = IngredientsContext;

export const useIngredients = () => {
    const context = useContext(IngredientsContext);
    if (!context) {
        throw new Error('useIngredients must be used within an IngredientsProvider');
    }
    return context;
};

interface IIngredientsProviderProps {
    children: ReactElement;
    initialState: IIngredient[];
}

const IngredientsProvider: FC<IIngredientsProviderProps> = ({ children, initialState }) => {
    const [ingredients, setIngredients] = useState<IIngredient[]>(initialState);

    const [quantityValues, setQuantityValues] = useState<(number | null)[]>(
        ingredients.map((ingredient) => (ingredient.quantity?.length ? ingredient.quantity[0] : null))
    );
    const [unitValues, setUnitValues] = useState<(string | null)[]>(ingredients.map((ingredient) => ingredient.unit ?? null));
    const [itemValues, setItemValues] = useState<(string | null)[]>(ingredients.map((ingredient) => ingredient.item));
    const [prepStyleValues, setPrepStyleValues] = useState<(string | null)[]>(
        ingredients.map((ingredient) => ingredient.prepStyles ?? null)
    );
    const [noteValues, setNoteValues] = useState<(string | null)[]>(ingredients.map((ingredient) => ingredient.notes ?? null));

    const validateIngredients = useCallback((): boolean => {
        if (!isArrayOf(itemValues, isString)) {
            createToast('error', 'Ingredients cannot be left empty');
            return false;
        }

        return true;
    }, [itemValues]);

    const saveIngredients = useCallback(() => {
        if (!isArrayOf(itemValues, isString)) {
            return createToast('error', 'Ingredients cannot be left empty');
        }

        const compiledIngredients: IIngredient[] = [];

        itemValues.forEach((_, i) => {
            const quantity = quantityValues[i];
            compiledIngredients.push({
                quantity: quantity ? [quantity] : null,
                unit: unitValues[i],
                item: itemValues[i],
                prepStyles: prepStyleValues[i],
                notes: noteValues[i],
                source: '', // TODO: Add source support
                match: null
            });
        });

        setIngredients(compiledIngredients);
    }, [quantityValues, unitValues, itemValues, prepStyleValues, noteValues]);

    const value = {
        ingredients,
        quantityValues,
        unitValues,
        itemValues,
        prepStyleValues,
        noteValues,
        setIngredients,
        setQuantityValues,
        setUnitValues,
        setItemValues,
        setPrepStyleValues,
        setNoteValues,
        saveIngredients,
        validateIngredients
    };

    return <Provider value={value}>{children}</Provider>;
};

export default IngredientsProvider;