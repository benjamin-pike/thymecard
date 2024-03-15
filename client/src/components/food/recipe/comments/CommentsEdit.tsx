import { useCallback, useEffect, useRef } from 'react';
import styles from './comments-edit.module.scss';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { ICONS } from '@/assets/icons';
import { useRecipe } from '../../../providers/RecipeProvider';
import { DateTime } from 'luxon';

const AddIcon = ICONS.common.plus;
const RemoveIcon = ICONS.common.XLarge;

const CommentsEdit = () => {
    const { comments } = useRecipe();

    const commentRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

    const scaleTextArea = useCallback((textArea?: HTMLTextAreaElement) => {
        if (!textArea) return;

        textArea.style.height = 'auto';

        const style = window.getComputedStyle(textArea);
        const paddingTop = parseFloat(style.paddingTop);
        const paddingBottom = parseFloat(style.paddingBottom);

        const verticalPadding = paddingTop + paddingBottom;

        textArea.style.height = `${textArea.scrollHeight - verticalPadding}px`;
    }, []);

    const handleChange = useCallback(
        (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            scaleTextArea(e.target);
            comments.update(e.target.value, index);
        },
        [scaleTextArea, comments]
    );

    useEffect(() => {
        commentRefs.current.forEach((comment) => scaleTextArea(comment ?? undefined));
    }, [scaleTextArea]);

    return (
        <div className={styles.wrapper}>
            <ScrollWrapper height={'100%'} padding={1} useScrollButtons={false} useScrollBar={true}>
                <div className={styles.comments}>
                    <button className={styles.addButton} onClick={() => comments.add()}>
                        <AddIcon /> Add Note
                    </button>
                    {comments.edit?.map((comment, i) => (
                        <div
                            key={i}
                            className={styles.comment}
                            data-created={DateTime.fromISO(comment.createdAt).toFormat('HH:mm  •  dd MMMM yyyy')}
                        >
                            <textarea
                                ref={(el) => (commentRefs.current[i] = el)}
                                value={comment.comment}
                                rows={1}
                                placeholder="Add a note..."
                                onChange={handleChange(i)}
                            />
                            <button className={styles.removeButton} onClick={comments.remove(i)}>
                                <RemoveIcon />
                            </button>
                        </div>
                    ))}
                </div>
            </ScrollWrapper>
        </div>
    );
};

export default CommentsEdit;
