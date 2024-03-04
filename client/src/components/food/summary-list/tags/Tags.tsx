import { FC, useCallback, useMemo } from 'react';
import { useToggle } from '@mantine/hooks';
import { ICONS } from '@/assets/icons';
import styles from './tags.module.scss';

const ToggleIcon = ICONS.common.toggle;

export interface ITag {
    name: string;
    count: number;
}

interface ITagsProps {
    validTags: ITag[];
    visibleTags: ITag[];
    selectedTags: string[];
    setSelectedTags: (filters: string[]) => void;
    handleTagClick: (tag: string) => void;
}

const Tags: FC<ITagsProps> = ({ validTags, visibleTags, selectedTags, handleTagClick }) => {
    const [isTagDrawerOpen, toggleIsTagDrawerOpen] = useToggle([false, true]);

    const tags = useMemo(() => {
        const validTagMap = new Map(validTags.map((tag) => [tag.name, tag]));
        const selectedTagsWithCounts = selectedTags.map((tag) => validTagMap.get(tag) as ITag);
        const unselectedTags = visibleTags.sort((a, b) => b.count - a.count).filter(({ name }) => !selectedTags.includes(name));

        return [...selectedTagsWithCounts, ...unselectedTags];
    }, [validTags, selectedTags, visibleTags]);

    const handleToggleTagDrawer = useCallback(() => {
        toggleIsTagDrawerOpen();
    }, [toggleIsTagDrawerOpen]);

    return (
        <section className={styles.tags} data-open={isTagDrawerOpen}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    {tags.map(({ name, count }) => (
                        <Tag key={`tag${name}`} tag={name} count={count} selectedTags={selectedTags} handleClick={handleTagClick} />
                    ))}
                    {isTagDrawerOpen && (
                        <button className={styles.showMore} onClick={handleToggleTagDrawer}>
                            <ToggleIcon />
                        </button>
                    )}
                </div>
            </div>
            {!isTagDrawerOpen && (
                <button className={styles.showMore} onClick={handleToggleTagDrawer}>
                    <ToggleIcon />
                    {isTagDrawerOpen && <p>Show Less</p>}
                </button>
            )}
        </section>
    );
};

export default Tags;
interface ITagProps {
    tag: string;
    count: number;
    selectedTags: string[];
    handleClick: (tag: string) => void;
}

const Tag: FC<ITagProps> = ({ tag, count, selectedTags, handleClick }) => {
    return (
        <button
            key={tag}
            className={styles.chip}
            data-active={selectedTags.includes(tag)}
            style={{ maxWidth: `${5 * tag.length + 100}px` }}
            onClick={() => handleClick(tag)}
        >
            <p>
                <span className={styles.name}>{tag}</span> <span className={styles.count}>{count}</span>
            </p>
        </button>
    );
};
