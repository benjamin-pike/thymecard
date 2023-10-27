import { FC, useRef } from 'react';
import { useRecipe } from '../../RecipeProvider';
import { ICONS } from '@/assets/icons';
import { collateRecipeTags } from '@/lib/recipe.utils';
import styles from './tags.module.scss';
import { queue } from '@/lib/common.utils';
import { capitalize } from '@/lib/string.utils';

const DeleteIcon = ICONS.common.XLarge;

const Tags: FC = () => {
    const { isEditing } = useRecipe();

    return (
        <div className={styles.tags} data-editing={isEditing}>
            {isEditing ? <EditView /> : <DisplayView />}
        </div>
    );
};

export default Tags;

const EditView: FC = () => {
    const { recipe, tags } = useRecipe();

    if (!recipe) {
        return null;
    }

    return (
        <>
            <div className={styles.addTagButtons} data-empty={tags.edit.length === 0}>
                <button className={styles.cuisine} onClick={tags.handleCreate('cuisine')}>
                    <span>Add </span>Cuisine
                </button>
                <button className={styles.diet} onClick={tags.handleCreate('diet')}>
                    <span>Add </span>Diet
                </button>
                <button className={styles.category} onClick={tags.handleCreate('category')}>
                    <span>Add </span>Category
                </button>
            </div>
            {tags.edit.length > 0 && (
                <ul>
                    {tags.edit.map((tag, i) => (
                        <li key={i} className={styles.tagEdit} data-type={tags.getType(i)}>
                            <p contentEditable placeholder={capitalize(tags.getType(i))} onBlur={tags.handleBlur(i)}>
                                {tag}
                            </p>
                            <button onClick={tags.handleDelete(i)}>
                                <DeleteIcon />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

const DisplayView: FC = () => {
    const { recipe } = useRecipe();
    const ref = useRef<HTMLParagraphElement>(null);

    if (!recipe) {
        return null;
    }

    const tags = collateRecipeTags(recipe);

    queue(() => {
        if (!ref.current) {
            return;
        }

        ref.current.style.visibility = 'hidden';
        ref.current.style.width = 'unset';

        const spans = [...ref.current.children] as HTMLSpanElement[];

        const leftPoint = ref.current.getBoundingClientRect().left;
        const rightPoint = spans.reduce((acc, span) => {
            const rect = span.getBoundingClientRect();
            return rect.right > acc ? rect.right : acc;
        }, 0);

        ref.current.style.width = `${rightPoint - leftPoint + 16}px`;

        ref.current.style.visibility = 'visible';
    });

    return (
        <p ref={ref} className={styles.tagsDisplay}>
            {tags.map((tag) => (
                <>
                    <span className={styles.tagDisplay} key={tag}>
                        {tag}
                    </span>{' '}
                </>
            ))}
        </p>
    );
};
