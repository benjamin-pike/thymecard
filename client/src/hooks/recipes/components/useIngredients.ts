import { useCallback, useReducer, useState } from 'react';
import { IRecipeIngredient, IRecipeIngredientMatch, RecipeIngredients } from '@thymecard/types';
import { createToast } from '@/lib/toast/toast.utils';

const useIngredients = () => {
    const [initial, setInitial] = useState<RecipeIngredients>([]);
    const [values, dispatch] = useReducer(ingredientsReducer, {
        quantity: [],
        unit: [],
        item: [],
        prepStyle: [],
        note: [],
        match: []
    });

    const init = useCallback((data: IRecipeIngredient[]) => {
        if (!data) {
            setInitial([
                {
                    item: '',
                    quantity: null,
                    unit: null,
                    prepStyles: null,
                    notes: null,
                    match: null
                }
            ]);
            dispatch({
                type: 'INIT',
                payload: { quantity: [null], unit: [null], item: [null], prepStyle: [null], note: [null], match: [null] }
            });

            return;
        }

        const payload = data.reduce<IngredientsState>(
            (acc, ingredient) => {
                const quantity = ingredient.quantity ? ingredient.quantity.map((n) => n.toString()).join(' - ') : null;

                acc.quantity.push(quantity);
                acc.unit.push(ingredient.unit ?? null);
                acc.item.push(ingredient.item ?? null);
                acc.prepStyle.push(ingredient.prepStyles ?? null);
                acc.note.push(ingredient.notes ?? null);
                acc.match.push(ingredient.match ?? null);

                return acc;
            },
            {
                quantity: [],
                unit: [],
                item: [],
                prepStyle: [],
                note: [],
                match: []
            }
        );

        setInitial(data);
        dispatch({ type: 'INIT', payload });
    }, []);

    const validate = useCallback((): { value: IRecipeIngredient[]; isModified: boolean } => {
        if (!values.item.length) {
            createToast('error', 'Recipe has no ingredients');
            throw new Error('Recipe has no ingredients');
        }

        const compiledIngredients = values.item.map((item, i) => {
            if (!item) {
                createToast('error', 'All ingredients must be named');
                throw new Error('All ingredients must be named');
            }
            const quantityArr = values.quantity[i];
            const parsedQuantity = quantityArr ? quantityArr.split('-').map((n) => parseFloat(n)) : null;

            if (parsedQuantity && parsedQuantity.some((n) => isNaN(n))) {
                createToast('error', 'An ingredient quantity is invalid');
                throw new Error('An ingredient quantity is invalid');
            }

            return {
                item,
                quantity: parsedQuantity?.length ? parsedQuantity : null,
                unit: values.unit[i] ?? null,
                prepStyles: values.prepStyle[i] ?? null,
                notes: values.note[i] ?? null,
                match: values.match[i] ?? null
            };
        });

        const isModified = initial.some((item, i) => {
            return (
                item.item !== values.item[i] ||
                (item.quantity?.join(' - ') ?? null) !== values.quantity[i] ||
                (item.unit ?? null) !== values.unit[i] ||
                (item.prepStyles ?? null) !== values.prepStyle[i] ||
                (item.notes ?? null) !== values.note[i] ||
                (item.match ?? null)?.itemId !== values.match[i]?.itemId ||
                (item.match ?? null)?.name !== values.match[i]?.name
            );
        });

        return { value: compiledIngredients, isModified };
    }, [initial, values.item, values.match, values.note, values.prepStyle, values.quantity, values.unit]);

    const setValues = useCallback((field: INGREDIENTS_FIELDS, index: number, value: any) => {
        dispatch({ type: field, payload: { index, value } });
    }, []);

    const addIngredient = useCallback(() => {
        dispatch({ type: 'ADD_INGREDIENT' });
    }, []);

    const removeIngredient = useCallback(
        (index: number) => {
            const ingredient = values.item[index];
            dispatch({ type: 'REMOVE_INGREDIENT', payload: index });

            if (!ingredient) {
                return;
            }

            createToast('info', `Removed ${ingredient}`);
        },
        [values.item]
    );

    return {
        values,
        init,
        validate,
        setValues,
        addIngredient,
        removeIngredient
    };
};

export default useIngredients;

interface IngredientsState {
    quantity: (string | null)[];
    unit: (string | null)[];
    item: (string | null)[];
    prepStyle: (string | null)[];
    note: (string | null)[];
    match: (IRecipeIngredientMatch | null)[];
}

export enum INGREDIENTS_FIELDS {
    QUANTITY = 'quantity',
    UNIT = 'unit',
    ITEM = 'item',
    PREP_STYLE = 'prepStyle',
    NOTE = 'note',
    MATCH = 'match'
}

type IngredientsAction =
    | { type: 'INIT'; payload: IngredientsState }
    | { type: 'ADD_INGREDIENT' }
    | { type: 'REMOVE_INGREDIENT'; payload: number }
    | { type: INGREDIENTS_FIELDS.QUANTITY; payload: { index: number; value: string | null } }
    | { type: INGREDIENTS_FIELDS.UNIT; payload: { index: number; value: string | null } }
    | { type: INGREDIENTS_FIELDS.ITEM; payload: { index: number; value: string | null } }
    | { type: INGREDIENTS_FIELDS.PREP_STYLE; payload: { index: number; value: string | null } }
    | { type: INGREDIENTS_FIELDS.NOTE; payload: { index: number; value: string | null } }
    | { type: INGREDIENTS_FIELDS.MATCH; payload: { index: number; value: IRecipeIngredientMatch | null } };

const ingredientsReducer = (values: IngredientsState, action: IngredientsAction): IngredientsState => {
    switch (action.type) {
        case 'INIT':
            return action.payload;
        case 'ADD_INGREDIENT':
            return {
                quantity: [...values.quantity, null],
                unit: [...values.unit, null],
                item: [...values.item, null],
                prepStyle: [...values.prepStyle, null],
                note: [...values.note, null],
                match: [...values.match, null]
            };
        case 'REMOVE_INGREDIENT': {
            const updatedQuantityValues = [...values.quantity];
            updatedQuantityValues.splice(action.payload, 1);

            const updatedUnitValues = [...values.unit];
            updatedUnitValues.splice(action.payload, 1);

            const updatedItemValues = [...values.item];
            updatedItemValues.splice(action.payload, 1);

            const updatedPrepStyleValues = [...values.prepStyle];
            updatedPrepStyleValues.splice(action.payload, 1);

            const updatedNoteValues = [...values.note];
            updatedNoteValues.splice(action.payload, 1);

            const updatedMatchValues = [...values.match];
            updatedMatchValues.splice(action.payload, 1);

            return {
                quantity: updatedQuantityValues,
                unit: updatedUnitValues,
                item: updatedItemValues,
                prepStyle: updatedPrepStyleValues,
                note: updatedNoteValues,
                match: updatedMatchValues
            };
        }
        case INGREDIENTS_FIELDS.QUANTITY: {
            const updatedQuantityValues = [...values.quantity];
            updatedQuantityValues[action.payload.index] = action.payload.value;
            return { ...values, quantity: updatedQuantityValues };
        }
        case INGREDIENTS_FIELDS.UNIT: {
            const updatedUnitValues = [...values.unit];
            updatedUnitValues[action.payload.index] = action.payload.value;
            return { ...values, unit: updatedUnitValues };
        }
        case INGREDIENTS_FIELDS.ITEM: {
            const updatedItemValues = [...values.item];
            updatedItemValues[action.payload.index] = action.payload.value;
            return { ...values, item: updatedItemValues };
        }
        case INGREDIENTS_FIELDS.PREP_STYLE: {
            const updatedPrepStyleValues = [...values.prepStyle];
            updatedPrepStyleValues[action.payload.index] = action.payload.value;
            return { ...values, prepStyle: updatedPrepStyleValues };
        }
        case INGREDIENTS_FIELDS.NOTE: {
            const updatedNoteValues = [...values.note];
            updatedNoteValues[action.payload.index] = action.payload.value;
            return { ...values, note: updatedNoteValues };
        }

        case INGREDIENTS_FIELDS.MATCH: {
            const updatedMatchValues = [...values.match];
            updatedMatchValues[action.payload.index] = action.payload.value;
            return { ...values, match: updatedMatchValues };
        }

        default:
            return values;
    }
};
