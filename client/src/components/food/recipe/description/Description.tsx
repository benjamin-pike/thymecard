import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import TextSkeleton from '@/components/common/loading-skeleton/TextSkeleton';
import { useRecipe } from '../../../providers/RecipeProvider';
import { ICONS } from '@/assets/icons';
import styles from './description.module.scss';

const ExpandIcon = ICONS.common.toggle;

const Description: FC = () => {
    const { recipe, description, isLoading, isEditing } = useRecipe();

    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isExpanded, toggleIsExpanded] = useToggle([false, true]);

    const ref = useRef<HTMLParagraphElement>(null);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const scaleTextArea = useCallback((textArea?: HTMLTextAreaElement) => {
        if (!textArea) return;

        textArea.style.height = 'auto';

        const style = window.getComputedStyle(textArea);
        const paddingTop = parseFloat(style.paddingTop);
        const paddingBottom = parseFloat(style.paddingBottom);

        const verticalPadding = paddingTop + paddingBottom;

        textArea.style.height = `${textArea.scrollHeight - verticalPadding}px`;
    }, []);

    const handleDescriptionInputFocus = useCallback(
        (e: React.FocusEvent<HTMLTextAreaElement>) => {
            scaleTextArea(e.target);
        },
        [scaleTextArea]
    );

    const handleDescriptionChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            scaleTextArea(e.target);
            description.handleDescriptionChange(e);
        },
        [description, scaleTextArea]
    );

    const handleExpandButtonClick = useCallback(() => {
        toggleIsExpanded();
    }, [toggleIsExpanded]);

    useEffect(() => {
        scaleTextArea(textAreaRef.current ?? undefined);
    }, [scaleTextArea, isEditing]);

    const checkOverflow = useCallback(() => {
        if (ref.current) {
            if (ref.current.clientHeight < ref.current.scrollHeight) {
                setIsOverflowing(true);
                return;
            }
            if (!isExpanded) {
                setIsOverflowing(false);
            }
        }
    }, [isExpanded]);

    useEffect(() => toggleIsExpanded(false), [recipe, toggleIsExpanded]);

    useEffect(checkOverflow, [checkOverflow, recipe]);

    return (
        <section className={styles.description} data-editing={isEditing} data-empty={!description.edit}>
            {isEditing ? (
                <textarea
                    ref={textAreaRef}
                    rows={1}
                    className={styles.input}
                    value={description.edit ?? ''}
                    placeholder="Add recipe description . . ."
                    data-empty={!description.edit}
                    onChange={handleDescriptionChange}
                    onFocus={handleDescriptionInputFocus}
                />
            ) : isLoading ? (
                <div className={styles.skeleton}>
                    <TextSkeleton fontSize={1} width="100%" />
                    <TextSkeleton fontSize={1} width="100%" />
                    <TextSkeleton fontSize={1} width="80%" />
                </div>
            ) : (
                <p ref={ref} data-expanded={isExpanded}>
                    {description.edit}
                </p>
            )}
            {!isLoading && (
                <div className={styles.buttons}>
                    {isOverflowing && !isEditing && (
                        <button className={styles.expand} data-active={isExpanded} onClick={handleExpandButtonClick}>
                            <ExpandIcon />
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default Description;
