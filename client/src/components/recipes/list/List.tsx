import { FC, useCallback, useDeferredValue, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useIntersection } from '@mantine/hooks';

import LoadingDots from '@/components/common/loading-dots/LoadingDots';
import Filter from '@/components/recipes/list/filter/Filter';
import Search from '../common/search/Search';
import Tags, { ITag } from './tags/Tags';
import ListEntry from './list-entry/ListEntry';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';

import { ICONS } from '@/assets/icons';
import { filterRecipes, filterReducer } from './filter/filter.functions';
import { generateMockRecipeList } from '@/test/mock-data/recipes';

import styles from './list.module.scss';

const SearchIcon = ICONS.common.search;

interface IListProps {
    handleSelectRecipe: (recipeId: string) => void;
}

const List: FC<IListProps> = ({ handleSelectRecipe }) => {
    const listEntries = useMemo(() => generateMockRecipeList(), []);

    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [listLength, setListLength] = useState(25);
    const listContainerRef = useRef<HTMLDivElement>(null);

    const { ref: loadingRef, entry } = useIntersection({
        root: listContainerRef.current,
        threshold: 1
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            setTimeout(() => setListLength((prev) => prev + 25), 500);
        }
    }, [entry]);

    const [filterState, filterDispatch] = useReducer(filterReducer, {
        sortBy: { variable: 'date', sort: -1 },
        minRating: 0,
        bookmarked: 'both',
        maxTime: 120
    });

    const validRecipes = useMemo(() => {
        return filterRecipes(listEntries, filterState).filter(
            (entry) =>
                (!deferredSearch ||
                    entry.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
                    entry.tags.some((tag) => tag.toLowerCase().includes(deferredSearch.toLowerCase()))) &&
                (!selectedTags || selectedTags.every((tag) => entry.tags.includes(tag)))
        );
    }, [listEntries, filterState, deferredSearch, selectedTags]);

    const validTags: ITag[] = validRecipes
        .flatMap((obj) => obj.tags)
        .reduce<ITag[]>((acc, tag) => {
            let entry = acc.find(({ name }) => name === tag);

            if (!entry) {
                entry = { name: tag, count: 0 };
                acc.push(entry);
            }

            entry.count++;

            return acc;
        }, [])
        .sort((a, b) => b.count - a.count);
    const visibleTags = validTags.filter(({ count }, i) => i < 15 || count > 1).slice(0, 15);

    useEffect(() => setListLength(25), [validRecipes, filterState]);

    const handleTagClick = useCallback(
        (tag: string) => {
            if (selectedTags.includes(tag)) {
                return setSelectedTags(selectedTags.filter((t) => t !== tag));
            }

            setSelectedTags([...selectedTags, tag]);
        },
        [selectedTags]
    );

    return (
        <div className={styles.content}>
            <div className={styles.topBar}>
                <Search
                    primaryPlaceholder={'Search'}
                    secondaryPlaceholder={'by title or keyword . . .'}
                    icon={<SearchIcon className={styles.searchIcon} />}
                    value={search}
                    setValue={setSearch}
                />
                <Filter state={filterState} dispatch={filterDispatch} />
            </div>
            <Tags
                validTags={validTags}
                visibleTags={visibleTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                handleTagClick={handleTagClick}
            />
            <div ref={listContainerRef} className={styles.scrollContainer}>
                <ScrollWrapper padding={0.5} height={'100%'}>
                    <>
                        <ul className={styles.list}>
                            {validRecipes.slice(0, listLength).map((entryProps, index) => (
                                <ListEntry key={index} selectedTags={selectedTags} handleSelectRecipe={handleSelectRecipe} handleTagClick={handleTagClick} {...entryProps} />
                            ))}
                        </ul>
                        {listLength < validRecipes.length && (
                            <div ref={loadingRef} className={styles.loadingDots}>
                                <LoadingDots />
                            </div>
                        )}
                    </>
                </ScrollWrapper>
            </div>
            <p className={styles.showing}>
                Showing <span>{validRecipes.length}</span> of <span>{listEntries.length}</span> recipes
            </p>
        </div>
    );
};

export default List;
