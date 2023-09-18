import { useCallback, useEffect, useState } from 'react';
import { useBreakpoints } from '@/hooks/dom/useBreakpoints';
import { useParams, useNavigate } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';

import Recipe from '@/components/recipes/recipe/Recipe';
import List from '@/components/recipes/list/List';
import CreateBar from '@/components/recipes/create-bar/CreateBar';
import Stock from '@/components/recipes/stock/Stock';
import Nutrition from '@/components/recipes/nutrition/Nutrition';
import DrawerWrapper from '@/components/wrappers/drawer/DrawerWrapper';

import { ICONS } from '@/assets/icons';

import styles from './recipes.module.scss';

const ListIcon = ICONS.common.list;
const SearchIcon = ICONS.common.search;

const Recipes = () => {
    const viewport = useBreakpoints([
        { name: 'listOnly', min: 0, max: 768 },
        { name: 'listPlus', min: 769, max: 1000 },
        { name: 'listHidden', min: 1001, max: 1200 },
        { name: 'all', min: 1201 }
    ]);

    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(recipeId ?? null);
    const [renderRecipe, setRenderRecipe] = useState(false);
    const [renderLanding, setRenderLanding] = useState(true);
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

    useEffect(() => {
        if (recipeId) {
            setRenderRecipe(true);
            setDisplayListDrawer(false);
        }
    }, [recipeId])

    const handleSelectRecipe = useCallback((recipeId: string) => {
        setSelectedRecipe(recipeId);
        setRenderRecipe(true);
        setDisplayListDrawer(false);

        navigate(`/recipes/${recipeId}`);

        setTimeout(() => {
            setRenderLanding(false);
        }, 400);
    }, []);

    const handleClearSelectedRecipe = useCallback(() => {
        setRenderLanding(true);
        setRenderRecipe(false);

        navigate('/recipes');

        setTimeout(() => {
            setSelectedRecipe(null);
        }, 400);
    }, []);

    const handleToggleVisibleInfo = useCallback(() => {
        toggleVisibleInfo();
    }, []);

    const handleRecipeFullscreen = useCallback(() => {
        toggleRecipeFullscreen();
    }, []);

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
                        <List handleSelectRecipe={handleSelectRecipe} />
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
                <section className={styles.right} data-mask={!!selectedRecipe}>
                    {selectedRecipe && (
                        <Recipe
                            recipeId={selectedRecipe}
                            isVisible={renderRecipe}
                            isRecipeFullscreen={isRecipeFullscreen}
                            handleRecipeFullscreen={handleRecipeFullscreen}
                            handleClearSelectedRecipe={handleClearSelectedRecipe}
                        />
                    )}
                    {renderLanding && (
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
                    )}
                </section>
            </div>
        </main>
    );
};

export default Recipes;
