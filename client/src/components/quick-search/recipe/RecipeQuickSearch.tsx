import { FC, useCallback, useState } from 'react';

import QuickSearch from '../QuickSearch';
import RecipeSearchResult from './RecipeSearchResult';

import { useRecipeAPI } from '@/api/useRecipeAPI';
import { QuickSearchState } from '@/hooks/common/useQuickSearch';

import { ICONS } from '@/assets/icons';
import { Client, IRecipe, IRecipeSearchResult } from '@thymecard/types';
import { buildRecipeImageUrl } from '@/lib/s3/s3.utils';
import { buildKey } from '@thymecard/utils';

import styles from './recipe-quick-search.module.scss';

const GoogleIcon = ICONS.auth.google;

interface IRecipeQuickSearchProps {
    state: QuickSearchState;
    handleSelectResult: (recipe: Client<IRecipe>) => Promise<void> | void;
    handleClose: () => void;
}

const RecipeQuickSearch: FC<IRecipeQuickSearchProps> = ({ state, handleClose, handleSelectResult }) => {
    const { searchRecipes, searchGoogleRecipes } = useRecipeAPI();

    const [recipes, setRecipes] = useState<Client<IRecipe>[]>();
    const [googleRecipes, setGoogleRecipes] = useState<Client<IRecipeSearchResult[]>>();

    const handleSearch = useCallback(
        async (query: string) => {
            const { data } = await searchRecipes(query);

            setRecipes(data);
        },
        [searchRecipes]
    );

    const handleSearchGoogle = useCallback(
        async (query: string) => {
            const results = await searchGoogleRecipes(query);

            setGoogleRecipes(results);
        },
        [searchGoogleRecipes]
    );

    return (
        <QuickSearch
            placeholder="Search for recipes"
            state={state}
            blurBackground={true}
            buttonIcon={<GoogleIcon />}
            buttonTooltipId="quick-search"
            buttonTooltipContent="Search for recipes"
            handleSearch={handleSearch}
            handleClearResults={() => setRecipes(undefined)}
            handleClose={handleClose}
            handleButtonAction={handleSearchGoogle}
        >
            <>
                {!!recipes?.length && (
                    <>
                        <div className={styles.divider} />
                        <ul className={styles.results}>
                            {recipes.map((recipe) => (
                                <RecipeSearchResult
                                    key={recipe.title}
                                    recipe={recipe}
                                    image={buildRecipeImageUrl(recipe.image)}
                                    handleSelectResult={handleSelectResult}
                                    handleCloseSearch={handleClose}
                                />
                            ))}
                        </ul>
                    </>
                )}
                {!!googleRecipes?.length && (
                    <>
                        <div className={styles.divider} />
                        <ul className={styles.results}>
                            {googleRecipes.map(({ recipe, image }, i) => (
                                <RecipeSearchResult
                                    key={buildKey(recipe.title, i)}
                                    recipe={recipe}
                                    image={image}
                                    handleSelectResult={handleSelectResult}
                                    handleCloseSearch={handleClose}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </>
        </QuickSearch>
    );
};

export default RecipeQuickSearch;
