import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBreakpoints } from '@/hooks/common/useBreakpoints';
import { useToggle } from '@mantine/hooks';
import { useRecipe } from '@/components/recipes/recipe/RecipeProvider';

import Recipe from '@/components/recipes/recipe/Recipe';
import SummaryList from '@/components/recipes/summary-list/SummaryList';
import CreateBar from '@/components/recipes/create-bar/CreateBar';
import Plan from '@/components/recipes/plan/Plan';
import Stock from '@/components/recipes/stock/Stock';
import StockProvider from '@/components/recipes/stock/StockProvider';
import DrawerWrapper from '@/components/wrappers/drawer/DrawerWrapper';

import { ICONS } from '@/assets/icons';

import styles from './recipes.module.scss';

const ListIcon = ICONS.common.list;
const PlannerIcon = ICONS.common.planner;

const Recipes = () => {
    const viewport = useBreakpoints([
        { name: 'oneColumnNarrowMargins', min: 0, max: 650 },
        { name: 'oneColumnWideMargins', min: 651, max: 860 },
        { name: 'twoColumns', min: 861, max: 1000 },
        { name: 'summariesHidden', min: 1001, max: 1300 },
        { name: 'threeColumns', min: 1301 }
    ]);

    const { recipeId: initialRecipeId } = useParams();

    const { renderStatus, getRecipe, clearRecipe, recipe } = useRecipe();

    const [isRecipeFullscreen, toggleRecipeFullscreen] = useToggle([false, true]);

    const [displayListDrawer, setDisplayListDrawer] = useState(false);
    const [displayStockDrawer, setDisplayStockDrawer] = useState(false);
    const [displayPlanDrawer, setDisplayPlanDrawer] = useState(false);

    const [showPlanOrStock, toggleVisibleInfo] = useToggle(['stock', 'plan'] as const);

    const displayListDrawerButton = viewport.current.isSummariesHidden;
    const displayInfoDrawerButtons = viewport.current.isOneColumnWideMargins || viewport.current.isOneColumnNarrowMargins;
    const displayStock = !viewport.current.isTwoColumns || (viewport.current.isTwoColumns && showPlanOrStock === 'stock');
    const displayPlan = !viewport.current.isTwoColumns || (viewport.current.isTwoColumns && showPlanOrStock === 'plan');

    const isCreateBarTopRight = !viewport.current.isTwoColumns;
    const isCreatBarBottom =
        viewport.current.isTwoColumns || viewport.current.isOneColumnWideMargins || viewport.current.isOneColumnNarrowMargins;

    const isInfoDrawersActive = viewport.current.isOneColumnWideMargins || viewport.current.isOneColumnNarrowMargins;

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
            {isCreatBarBottom && <CreateBar />}
            <div className={styles.body} data-fullscreen={isRecipeFullscreen}>
                <section className={styles.left}>
                    <DrawerWrapper
                        direction="left"
                        transitionDuration={200}
                        isVisible={displayListDrawer}
                        isActive={viewport.current.isSummariesHidden}
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
                        <div className={styles.summariesHiddenButtons}>
                            <button className={styles.plan} onClick={() => setDisplayPlanDrawer(true)}>
                                <PlannerIcon /> <p>Planner</p>
                            </button>
                            <div className={styles.divider} />
                            <button className={styles.stock} onClick={() => setDisplayStockDrawer(true)}>
                                <ListIcon /> <p>Inventory</p>
                            </button>
                        </div>
                    )}
                </section>
                <section className={styles.right} data-mask={renderStatus === 'open'} data-visible-panel={showPlanOrStock}>
                    <div className={styles.recipeWrapper} style={{ translate: renderStatus === 'open' ? '0 0' : '0 100%' }}>
                        <Recipe
                            viewport={viewport}
                            isRecipeFullscreen={isRecipeFullscreen}
                            handleRecipeFullscreen={handleRecipeFullscreen}
                            handleClearSelectedRecipe={handleClearSelectedRecipe}
                        />
                    </div>
                    <>
                        {isCreateBarTopRight && <CreateBar />}
                        <StockProvider>
                            <div className={styles.bottom}>
                                {displayPlan && (
                                    <DrawerWrapper
                                        direction="bottom"
                                        transitionDuration={200}
                                        isVisible={displayPlanDrawer}
                                        isActive={isInfoDrawersActive}
                                        closeDrawer={() => setDisplayPlanDrawer(false)}
                                    >
                                        <Plan handleSelectRecipe={getRecipe} handleToggleVisibleInfo={handleToggleVisibleInfo} />
                                    </DrawerWrapper>
                                )}
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
                            </div>
                        </StockProvider>
                    </>
                </section>
            </div>
        </main>
    );
};

export default Recipes;
