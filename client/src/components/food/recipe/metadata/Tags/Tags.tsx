import { FC, useRef } from 'react';
import { useRecipe } from '../../../../providers/RecipeProvider';
import { ICONS } from '@/assets/icons';
import { collateRecipeTags } from '@/lib/recipe.utils';
import { capitalize } from '@/lib/string.utils';
import styles from './tags.module.scss';

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

    return (
        <p ref={ref} className={styles.tagsDisplay}>
            {tags.map(({ name, type }) => (
                <>
                    <span key={name} className={styles.tagDisplay} data-type={type}>
                        {name}
                    </span>{' '}
                </>
            ))}
        </p>
    );
};
