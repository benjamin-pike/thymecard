import { FC } from 'react';
import { useRecipe } from '../../RecipeProvider';
import { ICONS } from '@/assets/icons';
import styles from './authors.module.scss';
import { buildKey } from '@sirona/utils';

const DeleteIcon = ICONS.common.XLarge;
const AddIcon = ICONS.common.plus;

const Authors: FC = () => {
    const { isEditing } = useRecipe();

    return (
        <p className={styles.authors} data-editing={isEditing}>
            <span className={styles.by}>By</span> {isEditing ? <EditView /> : <DisplayView />}
        </p>
    );
};

export default Authors;

const EditView: FC = () => {
    const { authors } = useRecipe();

    return (
        <>
            {authors.edit?.map((author, i) => (
                <div key={buildKey(author, i)} className={styles.author}>
                    <p contentEditable placeholder="Author name" onBlur={authors.handleBlur(i)}>
                        {author}
                    </p>
                    <button onClick={authors.handleDelete(i)}>
                        <DeleteIcon />
                    </button>
                </div>
            ))}
            <button className={styles.addAuthor} data-long={!authors.edit?.length} onClick={authors.handleAdd}>
                <AddIcon /> {!authors.edit?.length && 'Add author'}
            </button>
        </>
    );
};

const DisplayView: FC = () => {
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    return (
        <>
            {recipe.authors?.map((author, i, arr) => (
                <span key={buildKey('author', author, i)} className={styles.name}>
                    {author}
                    {i !== arr.length - 1 && ','}
                </span>
            ))}
        </>
    );
};
