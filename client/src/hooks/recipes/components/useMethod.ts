import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { IRecipeMethodSection, IRecipeMethodStep, RecipeMethod } from '@thymecard/types';
import { createToast } from '@/lib/toast/toast.utils';

const useMethod = () => {
    const [initial, setInitial] = useState<RecipeMethod>([]);
    const [edit, setEdit] = useState<RecipeMethod>([]);

    const init = useCallback((data: RecipeMethod) => {
        if (!data) {
            const sectionId = uuid();
            const stepId = uuid();

            setInitial([{ id: sectionId, sectionTitle: '', steps: [{ id: stepId, stepTitle: '', instructions: '' }] }]);
            setEdit([{ id: sectionId, sectionTitle: '', steps: [{ id: stepId, stepTitle: '', instructions: '' }] }]);
            return;
        }

        setInitial(data);
        setEdit(data);
    }, []);

    const validate = useCallback((): { value: RecipeMethod; isModified: boolean } => {
        if (!edit.length) {
            createToast('error', 'Recipe has no method');
            throw new Error('Recipe has no method');
        }

        const hasEmptySections = edit.some((section) => !section.steps.length);
        if (hasEmptySections) {
            createToast('error', 'Method sections cannot be empty');
            throw new Error('Method sections cannot be empty');
        }

        const hasEmptySteps = edit.some((section) => section.steps.some((step) => !step.instructions));
        if (hasEmptySteps) {
            createToast('error', 'Method steps cannot be empty');
            throw new Error('Method steps cannot be empty');
        }

        const isModified = checkIsModified(initial, edit);

        return { value: edit, isModified };
    }, [edit, initial]);

    const addSection = useCallback(() => {
        const newMethod = [...edit, { id: uuid(), sectionTitle: '', steps: [] }];
        setEdit(newMethod);
    }, [edit]);

    const updateSection = useCallback(
        (sectionId: string, update: IRecipeMethodSection) => {
            const newMethod = [...edit];
            const sectionIndex = newMethod.findIndex((section) => section.id === sectionId);

            if (sectionIndex === -1) {
                return;
            }

            newMethod[sectionIndex] = update;

            setEdit(newMethod);
        },
        [edit]
    );

    const deleteSection = useCallback(
        (id: string) => () => {
            console.log(id);
            const newMethod = edit.filter((section) => section.id !== id);
            console.log(newMethod);
            setEdit(newMethod);
        },
        [edit]
    );

    const addStep = useCallback(
        (sectionId: string) => () => {
            const section = edit.find((section) => section.id === sectionId);

            if (!section) {
                return;
            }

            const newSteps = [...section.steps, { id: uuid(), stepTitle: '', instructions: '' }];
            updateSection(section.id, { ...section, steps: newSteps });
        },
        [edit, updateSection]
    );

    const updateStep = useCallback(
        (sectionId: string, stepIndex: number, updatedStep: IRecipeMethodStep) => {
            const section = edit.find((section) => section.id === sectionId);

            if (!section) {
                return;
            }

            const newSteps = [...section.steps];
            newSteps[stepIndex] = updatedStep;
            updateSection(section.id, { ...section, steps: newSteps });
        },
        [edit, updateSection]
    );

    const deleteStep = useCallback(
        (sectionId: string, id: string) => () => {
            const section = edit.find((section) => section.id === sectionId);

            if (!section) {
                return;
            }

            const newSteps = section.steps.filter((step) => step.id !== id);
            updateSection(section.id, { ...section, steps: newSteps });
        },
        [edit, updateSection]
    );

    return {
        edit,
        init,
        validate,
        addSection,
        updateSection,
        deleteSection,
        addStep,
        updateStep,
        deleteStep
    };
};

export default useMethod;

const checkIsModified = (method1: RecipeMethod, method2: RecipeMethod): boolean => {
    if (method1.length !== method2.length) {
        return true;
    }

    for (let i = 0; i < method1.length; i++) {
        const section1 = method1[i];
        const section2 = method2[i];

        if (section1.sectionTitle !== section2.sectionTitle) {
            return true;
        }

        if (section1.steps.length !== section2.steps.length) {
            return true;
        }

        for (let j = 0; j < section1.steps.length; j++) {
            const step1 = section1.steps[j];
            const step2 = section2.steps[j];

            if (step1.stepTitle !== step2.stepTitle) {
                return true;
            }

            if (step1.instructions !== step2.instructions) {
                return true;
            }
        }
    }

    return false;
};
