import { createContext, useState, useContext, FC, ReactElement, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { IMethodSection, IMethodStep } from '@/types/recipe.types';
import { createToast } from '@/lib/toast/toast.utils';

interface IMethodContext {
    method: IMethodSection[];
    methodEdit: IMethodSection[];
    addSection: () => void;
    updateSection: (sectionId: string, update: IMethodSection) => void;
    deleteSection: (id: string) => () => void;
    addStep: (sectionId: string) => () => void;
    updateStep: (sectionId: string, stepIndex: number, updatedStep: IMethodStep) => void; 
    deleteStep: (sectionId: string, id: string) => () => void;
    saveMethod: () => void;
    validateMethod: () => boolean;
}

const MethodContext = createContext<IMethodContext | null>(null);
const { Provider } = MethodContext;

export const useMethod = () => {
    const context = useContext(MethodContext);
    if (!context) {
        throw new Error('useMethod must be used within a MethodProvider');
    }
    return context;
};

interface IMethodProviderProps {
    children: ReactElement;
    initialState: IMethodSection[];
}

const MethodProvider: FC<IMethodProviderProps> = ({ children, initialState }) => {
    const [method, setMethod] = useState<IMethodSection[]>(initialState);
    const [methodEdit, setMethodEdit] = useState<IMethodSection[]>(initialState);

    const validateMethod = useCallback((): boolean => {
        const hasEmptySteps = methodEdit.some((section) => section.steps.some((step) => !step.instructions));

        if (hasEmptySteps) {
            createToast('error', 'Steps cannot be left empty');
            return false;
        }

        return true;
    }, [methodEdit]);

    const saveMethod = useCallback(() => {
        setMethod(methodEdit);
    }, [methodEdit]);

    const addSection = () => {
        const newMethod = [...methodEdit, { id: uuid(), sectionTitle: '', steps: [] }];
        setMethodEdit(newMethod);
    };

    const updateSection = (sectionId: string, update: IMethodSection) => {
        const newMethod = [...methodEdit];
        const sectionIndex = newMethod.findIndex((section) => section.id === sectionId);

        if (sectionIndex === -1) {
            return;
        }

        newMethod[sectionIndex] = update;

        setMethodEdit(newMethod);
    };

    const deleteSection = (id: string) => () => {
        const newMethod = methodEdit.filter((section) => section.id !== id);
        setMethodEdit(newMethod);
    };

    const addStep = (sectionId: string) => () => {
        const section = methodEdit.find((section) => section.id === sectionId);

        if (!section) {
            return;
        }

        const newSteps = [...section.steps, { id: uuid(), stepTitle: '', instructions: '' }];
        updateSection(section.id, { ...section, steps: newSteps });
    };

    const updateStep = (sectionId: string, stepIndex: number, updatedStep: IMethodStep) => {
        const section = methodEdit.find((section) => section.id === sectionId);

        if (!section) {
            return;
        }

        const newSteps = [...section.steps];
        newSteps[stepIndex] = updatedStep;
        updateSection(section.id, { ...section, steps: newSteps });
    };

    const deleteStep = (sectionId: string, id: string) => () => {
        const section = methodEdit.find((section) => section.id === sectionId);

        if (!section) {
            return;
        }

        const newSteps = section.steps.filter((step) => step.id !== id);
        updateSection(section.id, { ...section, steps: newSteps });
    };

    const value = {
        method,
        methodEdit,
        addSection,
        updateSection,
        deleteSection,
        addStep,
        updateStep,
        deleteStep,
        saveMethod,
        validateMethod
    };

    return <Provider value={value}>{children}</Provider>;
};

export default MethodProvider;