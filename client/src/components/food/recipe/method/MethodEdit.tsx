import { memo, FC, useEffect, useCallback, useRef, useState } from 'react';
import { IRecipeMethodSection, IRecipeMethodStep } from '@thymecard/types';
import { ICONS } from '@/assets/icons';
import { useRecipe } from '../RecipeProvider';
import styles from './method-edit.module.scss';

const DeleteIcon = ICONS.common.XLarge;
const AddIcon = ICONS.common.plus;

const MethodEdit: FC = memo(() => {
    const { method, isIncomplete } = useRecipe();

    return (
        <ul className={styles.method}>
            {method.edit.map((section) => (
                <MethodSection key={section.id} section={section} />
            ))}
            <button className={styles.addButton} data-error={isIncomplete && method.edit.length === 0} onClick={method.addSection}>
                <AddIcon /> Add {method.edit.length ? 'Section' : 'Method'}
            </button>
        </ul>
    );
});

interface IRecipeMethodSectionProps {
    section: IRecipeMethodSection;
}

const MethodSection: FC<IRecipeMethodSectionProps> = memo(({ section }) => {
    const { method, isIncomplete } = useRecipe();

    const [localSectionTitle, setLocalSectionTitle] = useState(section.sectionTitle);

    const handleLocalTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setLocalSectionTitle(null);
            return;
        }

        setLocalSectionTitle(e.target.value);
    }, []);

    const handleBlur = () => {
        method.updateSection(section.id, { ...section, sectionTitle: localSectionTitle });
    };

    return (
        <li className={styles.section}>
            <>
                <div className={styles.sectionTitle}>
                    <input
                        value={localSectionTitle ?? ''}
                        placeholder="Add section title"
                        onChange={handleLocalTitleChange}
                        onBlur={handleBlur}
                    />
                    <button onClick={method.deleteSection(section.id)}>
                        <DeleteIcon />
                    </button>
                </div>
                <div className={styles.divider} />
            </>
            <ol className={styles.steps}>
                {section.steps.map((step, i) => (
                    <MethodStep key={step.id} index={i} section={section} step={step} />
                ))}
            </ol>
            <button
                className={styles.addButton}
                data-error={isIncomplete && section.steps.length === 0}
                onClick={method.addStep(section.id)}
            >
                <AddIcon /> Add Step
            </button>
        </li>
    );
});

interface IRecipeMethodStepProps {
    index: number;
    section: IRecipeMethodSection;
    step: IRecipeMethodStep;
}

const MethodStep: FC<IRecipeMethodStepProps> = memo(({ index, section, step }) => {
    const { method, isIncomplete } = useRecipe();

    const [localStepTitle, setLocalStepTitle] = useState(step.stepTitle);
    const [localInstructions, setLocalInstructions] = useState(step.instructions);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const scaleTextArea = useCallback((textArea: HTMLTextAreaElement | null) => {
        if (!textArea) {
            return;
        }

        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
    }, []);

    const handleLocalTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setLocalStepTitle(null);
            return;
        }

        setLocalStepTitle(e.target.value);
    }, []);

    const handleLocalInstructionsChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocalInstructions(e.target.value);
            scaleTextArea(textAreaRef.current);
        },
        [scaleTextArea]
    );

    const handleStepTitleBlur = () => {
        method.updateStep(section.id, index, { ...step, stepTitle: localStepTitle });
    };

    const handleInstructionsBlur = () => {
        method.updateStep(section.id, index, { ...step, instructions: localInstructions });
    };

    useEffect(() => {
        scaleTextArea(textAreaRef.current);
    }, [scaleTextArea]);

    return (
        <li className={styles.step} data-number={`${index + 1}.`}>
            <div className={styles.stepTitle}>
                <input
                    value={localStepTitle ?? ''}
                    placeholder="Add step title"
                    onChange={handleLocalTitleChange}
                    onBlur={handleStepTitleBlur}
                />
                <button onClick={method.deleteStep(section.id, step.id)}>
                    <DeleteIcon />
                </button>
            </div>
            <textarea
                ref={textAreaRef}
                className={styles.instructions}
                rows={1}
                value={localInstructions}
                placeholder="Add instructions"
                data-error={isIncomplete && !localInstructions}
                onChange={handleLocalInstructionsChange}
                onBlur={handleInstructionsBlur}
            />
        </li>
    );
});

export default MethodEdit;
