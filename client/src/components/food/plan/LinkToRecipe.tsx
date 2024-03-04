import React, { FC, useState, useCallback } from 'react';
import { useRecipeAPI } from '@/api/useRecipeAPI';
import { useDebounce } from '@/hooks/common/useDebounce';

import Tooltip from '@/components/common/tooltip/Tooltip';

import { IRecipe } from '@thymecard/types';
import { ICONS } from '@/assets/icons';

import styles from './link-to-recipe.module.scss';
import { useMount } from '@/hooks/common/useMount';

const SearchIcon = ICONS.common.search;
const ClearIcon = ICONS.common.XSmall;

interface ILinkToRecipeProps {
    handleLinkRecipe: (recipe: IRecipe) => void;
}

export const LinkToRecipe: FC<ILinkToRecipeProps> = ({ handleLinkRecipe }) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [recipes, setRecipes] = useState<IRecipe[]>();
    const { searchRecipes } = useRecipeAPI();

    const debouncedSearch = useDebounce(async (query: string) => {
        const { data } = await searchRecipes(query);

        setRecipes(data);
    }, 150);

    const handleSeachChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);

            debouncedSearch(e.target.value);
        },
        [debouncedSearch]
    );

    const handleClearSearch = useCallback(() => {
        setSearchValue('');

        debouncedSearch('');
    }, [debouncedSearch]);

    useMount(() => {
        debouncedSearch('');
    });

    return (
        <div className={styles.linkToRecipe}>
            <header className={styles.search}>
                <SearchIcon className={styles.searchIcon} />
                <input value={searchValue} placeholder="Search for a recipe to link" onChange={handleSeachChange} />
                <button className={styles.clear} onClick={handleClearSearch} data-empty={!searchValue}>
                    <ClearIcon className={styles.clearIcon} />
                </button>
            </header>
            <ul className={styles.recipes}>
                {recipes?.map((recipe) => (
                    <li key={recipe._id}>
                        <button onClick={() => handleLinkRecipe(recipe)}>{recipe.title}</button>
                    </li>
                ))}
            </ul>
            <button className={styles.nextPage} data-tooltip-id={'tooltip-load-more'} data-tooltip-content="Load more">
                • • •
            </button>
            <Tooltip id={'tooltip-load-more'} place="bottom" size="small" offset={5} />
        </div>
    );
};
