import { FC, useEffect, useCallback, useRef } from 'react';
import { IMethodSection, IMethodStep } from '@/types/recipe.types';
import { useMethod } from './MethodProvider';
import { ICONS } from '@/assets/icons';
import styles from './method-edit.module.scss';

const DeleteIcon = ICONS.common.XLarge;
const AddIcon = ICONS.common.plus;

const MethodEdit: FC = () => {
    const { methodEdit, addSection } = useMethod();

    return (
        <ul className={styles.method}>
            {methodEdit.map((section) => (
                <MethodSection key={section.id} section={section} />
            ))}
            <button className={styles.addButton} onClick={addSection}>
                <AddIcon /> Add Section
            </button>
        </ul>
    );
};

interface IMethodSectionProps {
    section: IMethodSection;
}

const MethodSection: FC<IMethodSectionProps> = ({ section }) => {
    const { updateSection, deleteSection, addStep } = useMethod();

    return (
        <li className={styles.section}>
            <div className={styles.sectionTitle}>
                <input
                    value={section.sectionTitle}
                    placeholder="Add section title"
                    onChange={(e) => updateSection(section.id, { ...section, sectionTitle: e.target.value })}
                />
                <button onClick={deleteSection(section.id)}>
                    <DeleteIcon />
                </button>
            </div>
            <div className={styles.divider} />
            <ol className={styles.steps}>
                {section.steps.map((step, i) => (
                    <MethodStep key={step.id} index={i} section={section} step={step} />
                ))}
            </ol>
            <button className={styles.addButton} onClick={addStep(section.id)}>
                <AddIcon /> Add Step
            </button>
        </li>
    );
};

interface IMethodStepProps {
    index: number;
    section: IMethodSection;
    step: IMethodStep;
}

const MethodStep: FC<IMethodStepProps> = ({ index, section, step }) => {
    const { updateStep, deleteStep } = useMethod();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const scaleTextArea = useCallback((textArea: HTMLTextAreaElement) => {
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
    }, []);

    useEffect(() => {
        if (textAreaRef.current) {
            scaleTextArea(textAreaRef.current);
        }
    }, [step.instructions, scaleTextArea]);

    return (
        <li className={styles.step} data-number={`${index + 1}.`}>
            <div className={styles.stepTitle}>
                <input
                    value={step.stepTitle}
                    placeholder="Add step title"
                    onChange={(e) => updateStep(section.id, index, { ...step, stepTitle: e.target.value })}
                />
                <button onClick={deleteStep(section.id, step.id)}>
                    <DeleteIcon />
                </button>
            </div>
            <textarea
                ref={textAreaRef}
                rows={1}
                value={step.instructions}
                placeholder="Add instructions"
                onChange={(e) => updateStep(section.id, index, { ...step, instructions: e.target.value })}
                className={styles.instructions}
            />
        </li>
    );
};

export default MethodEdit;
