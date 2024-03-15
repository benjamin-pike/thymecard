import { FC, useCallback } from 'react';
import TextSkeleton from '@/components/common/loading-skeleton/TextSkeleton';
import { useRecipe } from '../../../providers/RecipeProvider';
import { ICONS } from '@/assets/icons';
import styles from './title.module.scss';

const BookmarkOutlineIcon = ICONS.recipes.bookmark;
const BookmarkFillIcon = ICONS.recipes.bookmarkFill;

const Title: FC = () => {
    const { recipe, isLoading, isEditing, title, handleUpdateRecipe, isIncomplete } = useRecipe();

    const isError = !title.edit.length && isIncomplete;

    const handleBookmarkButtonClick = useCallback(() => {
        handleUpdateRecipe({ isBookmarked: !recipe?.isBookmarked });
    }, [recipe, handleUpdateRecipe]);

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
            ) : isLoading ? (
                <TextSkeleton fontSize={1.5} width="90%" />
            ) : (
                <h1>{recipe?.title}</h1>
            )}
            {!isLoading && (
                <span className={styles.buttons}>
                    {!isEditing && (
                        <button className={styles.bookmark} data-active={!!recipe?.isBookmarked} onClick={handleBookmarkButtonClick}>
                            {recipe?.isBookmarked ? <BookmarkFillIcon /> : <BookmarkOutlineIcon />}
                        </button>
                    )}
                </span>
            )}
        </span>
    );
};

export default Title;
