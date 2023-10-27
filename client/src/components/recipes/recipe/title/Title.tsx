import { FC, useCallback } from 'react';
import styles from './title.module.scss';
import { ICONS } from '@/assets/icons';
import { useRecipe } from '../RecipeProvider';

const BookmarkOutlineIcon = ICONS.recipes.bookmark;
const BookmarkFillIcon = ICONS.recipes.bookmarkFill;

const Title: FC = () => {
    const { recipe, isEditing, title, upsertRecipe, isIncomplete } = useRecipe();

    const isError = !title.edit.length && isIncomplete;

    const handleBookmarkButtonClick = useCallback(() => {
        upsertRecipe({ isBookmarked: !recipe?.isBookmarked });
    }, [recipe?.isBookmarked, upsertRecipe]);

    if (!recipe) {
        return null;
    }

    return (
        <span className={styles.title} data-editing={isEditing} data-error={isError}>
            {isEditing ? (
                <input
                    type="text"
                    className={styles.input}
                    value={title.edit}
                    placeholder="Add recipe title . . ."
                    onChange={title.handleTitleChange}
                />
            ) : (
                <h1>{recipe.title}</h1>
            )}
            <span className={styles.buttons}>
                {!isEditing && (
                    <button className={styles.bookmark} data-active={!!recipe?.isBookmarked} onClick={handleBookmarkButtonClick}>
                        {recipe?.isBookmarked ? <BookmarkFillIcon /> : <BookmarkOutlineIcon />}
                    </button>
                )}
            </span>
        </span>
    );
};

export default Title;
