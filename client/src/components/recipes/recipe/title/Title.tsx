import { FC, useCallback, useState } from 'react';
import styles from './title.module.scss';
import { ICONS } from '@/assets/icons';
import { useToggle } from '@mantine/hooks';

const EditIcon = ICONS.common.pen;
const BookmarkOutlineIcon = ICONS.recipes.bookmark;
const BookmarkFillIcon = ICONS.recipes.bookmarkFill;
const TickIcon = ICONS.common.tick;
const CancelIcon = ICONS.common.XLarge;

interface ITitleProps {
    value: string;
    bookmarked: boolean;
}

const Title: FC<ITitleProps> = ({ value, bookmarked }) => {
    const [title, setTitle] = useState(value);
    const [titleEdit, setTitleEdit] = useState(value);
    const [isEditing, setIsEditting] = useState(false);

    const [isBookmarked, toggleBookmarked] = useToggle([bookmarked, !bookmarked]);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleEdit(e.target.value);
    }, []);

    const handleEditButtonClick = useCallback(() => {
        setIsEditting(true);
    }, []);

    const handleBookmarkButtonClick = useCallback(() => {
        toggleBookmarked();
    }, []);

    const handleSaveButtonClick = useCallback(() => {
        setTitle(titleEdit);
        setIsEditting(false);
    }, [titleEdit]);

    const handleCancelButtonClick = useCallback(() => {
        setIsEditting(false);
        setTitleEdit(title);
    }, [title]);

    return (
        <span className={styles.title}>
            {isEditing ? (
                <input type="text" className={styles.input} value={titleEdit} autoFocus onChange={handleTitleChange} />
            ) : (
                <h1>{title}</h1>
            )}
            <span className={styles.buttons}>
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
                        <button className={styles.bookmark} data-active={isBookmarked} onClick={handleBookmarkButtonClick}>
                            {isBookmarked ? <BookmarkFillIcon /> : <BookmarkOutlineIcon />}
                        </button>
                    </>
                )}
            </span>
        </span>
    );
};

export default Title;
