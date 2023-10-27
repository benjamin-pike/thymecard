import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './tags.module.scss';
import { useToggle } from '@mantine/hooks';
import { ICONS } from '@/assets/icons';

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
    const [widths, setWidths] = useState<Record<string, number>>({});

    const containerRef = useRef<HTMLDivElement>(null);

    const validTagMap = useMemo(() => new Map(validTags.map((tag) => [tag.name, tag])), [validTags]);
    const selectedTagsWithCounts = selectedTags.map((tag) => validTagMap.get(tag) as ITag);
    const unselectedTags = visibleTags.sort((a, b) => b.count - a.count).filter(({ name }) => !selectedTags.includes(name));
    const combinedTags = [...selectedTagsWithCounts, ...unselectedTags];

    const [tagLines, growLastLine] = balanceTags(combinedTags, widths, containerRef, 20, 0.75);

    const handleWidthChange = useCallback((tag: string, width: number) => {
        return setWidths((prevWidths) => ({ ...prevWidths, [tag]: width }));
    }, []);

    const handleToggleTagDrawer = useCallback(() => {
        toggleIsTagDrawerOpen();
    }, [toggleIsTagDrawerOpen]);

    return (
        <section className={styles.tags} data-open={isTagDrawerOpen}>
            <div className={styles.wrapper}>
                <div ref={containerRef} className={styles.container}>
                    {tagLines.length ? (
                        tagLines.map((line, i, arr) => (
                            <TagLine
                                key={JSON.stringify(line)}
                                line={line}
                                selectedTags={selectedTags}
                                handleTagClick={handleTagClick}
                                fillSpace={i !== arr.length - 1 || growLastLine}
                            />
                        ))
                    ) : (
                        <DummyTags tags={validTags} handleWidthChange={handleWidthChange} />
                    )}
                </div>
            </div>
            <button className={styles.toggle} data-open={isTagDrawerOpen} onClick={handleToggleTagDrawer}>
                <ToggleIcon />
            </button>
        </section>
    );
};

export default Tags;

interface ITagBaseProps {
    tag: string;
    count: number;
}

interface ITagProps extends ITagBaseProps {
    selectedTags: string[];
    handleClick: (tag: string) => void;
}

interface IDummyTagProps extends ITagBaseProps {
    handleWidthChange: (tag: string, width: number) => void;
}

interface ITagLineProps {
    line: ITag[];
    selectedTags: string[];
    handleTagClick: (tag: string) => void;
    fillSpace: boolean;
}

interface IDummyTagsProps {
    tags: ITag[];
    handleWidthChange: (tag: string, width: number) => void;
}

const Tag: FC<ITagProps> = ({ tag, count, selectedTags, handleClick }) => {
    return (
        <button key={tag} className={styles.chip} data-active={selectedTags.includes(tag)} onClick={() => handleClick(tag)}>
            <p>
                <span className={styles.name}>{tag}</span> <span className={styles.count}>{count}</span>
            </p>
        </button>
    );
};

const DummyTag: FC<IDummyTagProps> = ({ tag, count, handleWidthChange }) => {
    const chipRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (chipRef.current && handleWidthChange) {
            const { width } = chipRef.current.getBoundingClientRect();
            handleWidthChange(tag, width);
        }
    }, [tag, count, handleWidthChange, chipRef]);

    return (
        <button key={tag} ref={chipRef} className={styles.chip}>
            <p>
                <span className={styles.name}>{tag}</span> <span className={styles.count}>{count}</span>
            </p>
        </button>
    );
};

const DummyTags: FC<IDummyTagsProps> = ({ tags, handleWidthChange }) => (
    <div className={styles.measurements}>
        {tags.map(({ name, count }) => (
            <DummyTag key={`dummy${name}`} tag={name} count={count} handleWidthChange={handleWidthChange} />
        ))}
    </div>
);

const TagLine: FC<ITagLineProps> = ({ line, selectedTags, handleTagClick, fillSpace }) => (
    <div key={JSON.stringify(line)} className={styles.line} data-grow={fillSpace}>
        {line.map(({ name, count }) => (
            <Tag key={`tag${name}`} tag={name} count={count} selectedTags={selectedTags} handleClick={handleTagClick} />
        ))}
    </div>
);

const balanceTags = (
    tags: ITag[],
    widths: Record<string, number>,
    containerRef: RefObject<HTMLDivElement>,
    gap: number,
    minRatio: number
): [ITag[][], boolean] => {
    if (!containerRef.current) {
        return [[], false];
    }

    const containerWidth = containerRef.current.offsetWidth;

    const totalWidth = tags.reduce((acc, { name }) => acc + widths[name] + gap, 0) - gap;

    const averageWidth = totalWidth / Math.ceil(totalWidth / containerWidth);

    const result: ITag[][] = [];
    let currentWidth = 0;
    let currentLine: ITag[] = [];

    for (const tag of tags) {
        if (currentWidth + widths[tag.name] + gap > averageWidth && currentLine.length > 0 && currentWidth / containerWidth >= minRatio) {
            result.push(currentLine);
            currentLine = [tag];
            currentWidth = widths[tag.name] + gap;
        } else {
            currentLine.push(tag);
            currentWidth += widths[tag.name] + gap;
        }
    }

    if (currentLine.length > 0) {
        result.push(currentLine);
    }

    let lastLineMeetsMinRatio = false;
    if (result.length > 0) {
        const lastLineWidth = result[result.length - 1].reduce((acc, { name }) => acc + widths[name] + gap, 0) - gap;
        lastLineMeetsMinRatio = lastLineWidth / containerWidth >= minRatio;
    }

    return [result, lastLineMeetsMinRatio];
};
