import { FC, useCallback, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { ICONS } from '@/assets/icons';
import styles from './description.module.scss';

const ExpandIcon = ICONS.common.toggle;
const EditIcon = ICONS.common.pen;
const TickIcon = ICONS.common.tick;
const CancelIcon = ICONS.common.XLarge;

interface IDescriptionProps {
    value: string;
}

const Description: FC<IDescriptionProps> = ({ value }) => {
    const [description, setDescription] = useState(value);
    const [descriptionEdit, setDescriptionEdit] = useState(value);
    const [isEditing, setIsEditting] = useState(false);

    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isExpanded, toggleIsExpanded] = useToggle([false, true]);

    const ref = useCallback((element: HTMLParagraphElement) => {
        if (element) {
            if (element.clientHeight < element.scrollHeight) {
                setIsOverflowing(true);
            }
        }
    }, []);

    const scaleTextArea = useCallback((textArea: HTMLTextAreaElement) => {
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
    }, []);

    const handleDescriptionInputFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        scaleTextArea(e.target);
    }, []);

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        scaleTextArea(e.target);
        setDescriptionEdit(e.target.value);
    }, []);

    const handleEditButtonClick = useCallback(() => {
        setIsEditting(true);
    }, []);

    const handleSaveButtonClick = useCallback(() => {
        setDescription(descriptionEdit);
        setIsEditting(false);
    }, [descriptionEdit]);

    const handleCancelButtonClick = useCallback(() => {
        setIsEditting(false);
        setDescriptionEdit(description);
    }, [description]);

    const handleExpandButtonClick = useCallback(() => {
        toggleIsExpanded();
    }, []);

    return (
        <section className={styles.description}>
            {isEditing ? (
                <textarea
                    className={styles.input}
                    value={descriptionEdit}
                    autoFocus
                    onChange={handleDescriptionChange}
                    onFocus={handleDescriptionInputFocus}
                />
            ) : (
                <p ref={ref} data-expanded={isExpanded}>
                    {description}
                </p>
            )}
            <div className={styles.buttons}>
                {isEditing ? (
                    <>
                        <button className={styles.save} onClick={handleSaveButtonClick}>
                            <TickIcon />
                        </button>
                        <button className={styles.cancel} onClick={handleCancelButtonClick}>
                            <CancelIcon />
                        </button>
                    </>
                ) : (
                    <>
                        <button className={styles.edit} onClick={handleEditButtonClick}>
                            <EditIcon />
                        </button>
                        {isOverflowing && (
                            <button className={styles.expand} data-active={isExpanded} onClick={handleExpandButtonClick}>
                                <ExpandIcon />
                            </button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Description;
