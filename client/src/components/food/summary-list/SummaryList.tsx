import { FC, useCallback, useDeferredValue, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useIntersection } from '@mantine/hooks';

import LoadingDots from '@/components/common/loading-dots/LoadingDots';
import Filter from '@/components/food/summary-list/filter/Filter';
import Search from '../search/Search';
import Tags, { ITag } from './tags/Tags';
import Summary from './summary/Summary';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';

import { useRecipe } from '../recipe/RecipeProvider';

import { ICONS } from '@/assets/icons';
import { filterRecipes, filterReducer } from './filter/filter.functions';
import { collateRecipeTags } from '@/lib/recipe.utils';

import styles from './summary-list.module.scss';

const SearchIcon = ICONS.common.search;

interface ISummaryListProps {
    handleSelectRecipe: (recipeId: string) => void;
}

const SummaryList: FC<ISummaryListProps> = ({ handleSelectRecipe }) => {
    const { summaries } = useRecipe();

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
        maxTime: 240
    });

    const validRecipes = useMemo(() => {
        return filterRecipes(summaries ?? [], filterState).filter((entry) => {
            const tags = collateRecipeTags(entry).map((tag) => tag.name);
            const isSearchedByName = entry.title.toLowerCase().includes(deferredSearch.toLowerCase());
            const isSearchedByTag = tags.some((tag) => tag.toLowerCase().includes(deferredSearch.toLowerCase()));
            const hasSelectedTags = selectedTags.every((tag) => tags.includes(tag));

            return (!deferredSearch || isSearchedByName || isSearchedByTag) && (!selectedTags.length || hasSelectedTags);
        });
    }, [summaries, filterState, deferredSearch, selectedTags]);

    const validTags: ITag[] = validRecipes
        .flatMap((obj) => collateRecipeTags(obj))
        .reduce<ITag[]>((acc, tag) => {
            let entry = acc.find(({ name }) => name === tag.name);

            if (!entry) {
                entry = { name: tag.name, count: 0 };
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
                    primaryPlaceholder={'Search recipes'}
                    secondaryPlaceholder={'by title or keyword . . .'}
                    icon={<SearchIcon className={styles.searchIcon} />}
                    value={search}
                    setValue={setSearch}
                />
                <Filter state={filterState} dispatch={filterDispatch} />
            </div>
            <Tags
                key={JSON.stringify(summaries)}
                validTags={validTags}
                visibleTags={visibleTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                handleTagClick={handleTagClick}
            />
            <div ref={listContainerRef} className={styles.scrollContainer}>
                <ScrollWrapper padding={0.5} height={'100%'} useScrollButtons={false}>
                    <>
                        <ul className={styles.list}>
                            {validRecipes.slice(0, listLength).map((recipe, index) => (
                                <Summary
                                    key={index}
                                    recipe={recipe}
                                    selectedTags={selectedTags}
                                    handleSelectRecipe={handleSelectRecipe}
                                    handleTagClick={handleTagClick}
                                />
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
                Showing <span>{validRecipes.length}</span> of <span>{summaries?.length}</span> recipes
            </p>
        </div>
    );
};

export default SummaryList;
