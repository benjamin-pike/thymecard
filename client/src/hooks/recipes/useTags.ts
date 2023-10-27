import { useCallback, useState } from 'react';

interface IValidate {
    update: string[] | undefined;
    isModified: boolean;
}

const useTags = () => {
    const [cuisineInitial, setCuisineInitial] = useState<string[]>([]);
    const [dietInitial, setDietInitial] = useState<string[]>([]);
    const [categoryInitial, setCategoryInitial] = useState<string[]>([]);

    const [cuisineEdit, setCuisineEdit] = useState<string[]>([]);
    const [dietEdit, setDietEdit] = useState<string[]>([]);
    const [categoryEdit, setCategoryEdit] = useState<string[]>([]);

    const edit = [...cuisineEdit, ...dietEdit, ...categoryEdit];

    const init = useCallback((cuisine: string[] | undefined, diet: string[] | undefined, category: string[] | undefined) => {
        setCuisineInitial(cuisine ?? []);
        setDietInitial(diet ?? []);
        setCategoryInitial(category ?? []);

        setCuisineEdit(cuisine ?? []);
        setDietEdit(diet ?? []);
        setCategoryEdit(category ?? []);
    }, []);

    const validate = useCallback((): { cuisine: IValidate; diet: IValidate; category: IValidate } => {
        return {
            cuisine: {
                update: (cuisineEdit?.length && cuisineEdit) || undefined,
                isModified: cuisineInitial?.join(',') !== cuisineEdit?.join(',')
            },
            diet: {
                update: (dietEdit?.length && dietEdit) || undefined,
                isModified: dietInitial?.join(',') !== dietEdit?.join(',')
            },
            category: {
                update: (categoryEdit?.length && categoryEdit) || undefined,
                isModified: categoryInitial?.join(',') !== categoryEdit?.join(',')
            }
        };
    }, [cuisineEdit, cuisineInitial, dietEdit, dietInitial, categoryEdit, categoryInitial]);

    const getType = useCallback(
        (index: number) => {
            if (index < cuisineEdit.length) return 'cuisine';
            if (index < cuisineEdit.length + dietEdit.length) return 'diet';
            return 'category';
        },
        [cuisineEdit, dietEdit]
    );

    const handleCreate = useCallback(
        (tagType: 'cuisine' | 'diet' | 'category') => () => {
            switch (tagType) {
                case 'cuisine':
                    setCuisineEdit([...cuisineEdit, '']);
                    break;
                case 'diet':
                    setDietEdit([...dietEdit, '']);
                    break;
                case 'category':
                    setCategoryEdit([...categoryEdit, '']);
                    break;
            }
        },
        [cuisineEdit, dietEdit, categoryEdit]
    );

    const handleBlur = useCallback(
        (index: number) => (e: React.ChangeEvent<HTMLParagraphElement>) => {
            const tagType = getType(index);

            switch (tagType) {
                case 'cuisine':
                    setCuisineEdit(cuisineEdit.map((tag, i) => (i === index ? e.target.innerText : tag)));
                    break;
                case 'diet':
                    setDietEdit(dietEdit.map((tag, i) => (i === index - cuisineEdit.length ? e.target.innerText : tag)));
                    break;
                case 'category':
                    setCategoryEdit(
                        categoryEdit.map((tag, i) => (i === index - cuisineEdit.length - dietEdit.length ? e.target.innerText : tag))
                    );
                    break;
            }
        },
        [getType, cuisineEdit, dietEdit, categoryEdit]
    );

    const handleDelete = useCallback(
        (index: number) => () => {
            const tagType = getType(index);

            switch (tagType) {
                case 'cuisine':
                    setCuisineEdit(cuisineEdit.filter((_, i) => i !== index));
                    break;
                case 'diet':
                    setDietEdit(dietEdit.filter((_, i) => i !== index - cuisineEdit.length));
                    break;
                case 'category':
                    setCategoryEdit(categoryEdit.filter((_, i) => i !== index - cuisineEdit.length - dietEdit.length));
                    break;
            }
        },
        [getType, cuisineEdit, dietEdit, categoryEdit]
    );

    return {
        edit,
        init,
        validate,
        handleCreate,
        handleBlur,
        handleDelete,
        getType
    };
};

export default useTags;
