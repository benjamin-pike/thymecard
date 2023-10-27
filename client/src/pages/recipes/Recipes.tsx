import { useCallback, useEffect, useState } from 'react';
import { useBreakpoints } from '@/hooks/common/useBreakpoints';
import { useToggle } from '@mantine/hooks';

import Recipe from '@/components/recipes/recipe/Recipe';
import SummaryList from '@/components/recipes/summary-list/SummaryList';
import CreateBar from '@/components/recipes/create-bar/CreateBar';
import Stock from '@/components/recipes/stock/Stock';
import Nutrition from '@/components/recipes/nutrition/Nutrition';
import DrawerWrapper from '@/components/wrappers/drawer/DrawerWrapper';

import { ICONS } from '@/assets/icons';

import styles from './recipes.module.scss';
import { useRecipe } from '@/components/recipes/recipe/RecipeProvider';
import { useParams } from 'react-router-dom';

const ListIcon = ICONS.common.list;
const SearchIcon = ICONS.common.search;

const Recipes = () => {
    const viewport = useBreakpoints([
        { name: 'listOnly', min: 0, max: 768 },
        { name: 'listPlus', min: 769, max: 1000 },
        { name: 'listHidden', min: 1001, max: 1200 },
        { name: 'all', min: 1201 }
    ]);

    const { recipeId: initialRecipeId } = useParams();

    const { renderStatus, getRecipe, clearRecipe, recipe } = useRecipe();

    const [isRecipeFullscreen, toggleRecipeFullscreen] = useToggle([false, true]);

    const [displayListDrawer, setDisplayListDrawer] = useState(false);
    const [displayStockDrawer, setDisplayStockDrawer] = useState(false);
    const [displayNutritionDrawer, setDisplayNutritionDrawer] = useState(false);
    const [visibleInfo, toggleVisibleInfo] = useToggle(['stock', 'nutrition'] as const);

    const displayFullWidthCreateBar = viewport.current.isListPlus || viewport.current.isListOnly;
    const displayRightCreateBar = !viewport.current.isListPlus;
    const displayListDrawerButton = viewport.current.isListHidden;
    const displayInfoDrawerButtons = viewport.current.isListOnly;
    const displayStock = !viewport.current.isListPlus || (viewport.current.isListPlus && visibleInfo === 'stock');
    const displayNutrition = !viewport.current.isListPlus || (viewport.current.isListPlus && visibleInfo === 'nutrition');

    const isInfoDrawersActive = viewport.current.isListOnly;

    const handleClearSelectedRecipe = useCallback(() => {
        clearRecipe();
    }, [clearRecipe]);

    const handleToggleVisibleInfo = useCallback(() => {
        toggleVisibleInfo();
    }, [toggleVisibleInfo]);

    const handleRecipeFullscreen = useCallback(() => {
        toggleRecipeFullscreen();
    }, [toggleRecipeFullscreen]);

    useEffect(() => {
        if (initialRecipeId && !recipe) {
            getRecipe(initialRecipeId);
        }
    }, [initialRecipeId, recipe, getRecipe]);

    return (
        <main className={styles.recipes}>
            {displayFullWidthCreateBar && <CreateBar />}
            <div className={styles.body} data-fullscreen={isRecipeFullscreen}>
                <section className={styles.left}>
                    <DrawerWrapper
                        direction="left"
                        transitionDuration={200}
                        isVisible={displayListDrawer}
                        isActive={viewport.current.isListHidden}
                        closeDrawer={() => setDisplayListDrawer(false)}
                    >
                        <SummaryList handleSelectRecipe={getRecipe} />
                    </DrawerWrapper>
                    {displayListDrawerButton && (
                        <button className={styles.displayDrawer} onClick={() => setDisplayListDrawer(true)}>
                            <ListIcon />
                        </button>
                    )}
                    {displayInfoDrawerButtons && (
                        <div className={styles.listHiddenButtons}>
                            <button className={styles.stock} onClick={() => setDisplayStockDrawer(true)}>
                                <ListIcon />
                            </button>
                            <button className={styles.nutrition} onClick={() => setDisplayNutritionDrawer(true)}>
                                <SearchIcon />
                            </button>
                        </div>
                    )}
                </section>
                <section className={styles.right} data-mask={renderStatus === 'open'}>
                    <div className={styles.recipeWrapper} style={{ translate: renderStatus === 'open' ? '0 0' : '0 100%' }}>
                        <Recipe
                            isRecipeFullscreen={isRecipeFullscreen}
                            handleRecipeFullscreen={handleRecipeFullscreen}
                            handleClearSelectedRecipe={handleClearSelectedRecipe}
                        />
                    </div>

                    <>
                        {displayRightCreateBar && <CreateBar />}
                        <div className={styles.bottom}>
                            {displayStock && (
                                <DrawerWrapper
                                    direction="bottom"
                                    transitionDuration={200}
                                    isVisible={displayStockDrawer}
                                    isActive={isInfoDrawersActive}
                                    closeDrawer={() => setDisplayStockDrawer(false)}
                                >
                                    <Stock handleToggleVisibleInfo={handleToggleVisibleInfo} />
                                </DrawerWrapper>
                            )}
                            {displayNutrition && (
                                <DrawerWrapper
                                    direction="bottom"
                                    transitionDuration={200}
                                    isVisible={displayNutritionDrawer}
                                    isActive={isInfoDrawersActive}
                                    closeDrawer={() => setDisplayNutritionDrawer(false)}
                                >
                                    <Nutrition handleToggleVisibleInfo={handleToggleVisibleInfo} />
                                </DrawerWrapper>
                            )}
                        </div>
                    </>
                </section>
            </div>
        </main>
    );
};

export default Recipes;
