import { FC, useCallback, useRef, useState } from 'react';
import { useIntersection, useToggle } from '@mantine/hooks';
import { useReactToPrint } from 'react-to-print';

import { ICONS } from '@/assets/icons';
import Title from './title/Title';
import Description from './description/Description';
import ImageGrid from '@/components/common/image-grid/ImageGrid';
import Metadata from './metadata/Metadata';
import Toolbar from './toolbar/Toolbar';
import IngredientsEdit from './ingredients/IngredientsEdit';
import IngredientsDisplay from './ingredients/IngredientsDisplay';
import IngredientsProvider from './ingredients/IngredientsProvider';
import ScaleIngredientsModal from './scale-ingredients-modal/ScaleIngredientsModal';
import MethodDisplay from './method/MethodDisplay';
import MethodEdit from './method/MethodEdit';
import MethodProvider from './method/MethodProvider';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import ModalWrapper from '@/components/wrappers/modal/ModalWrapper';

import { formatClasses, queue } from '@/lib/common.utils';
import { createToast } from '@/lib/toast/toast.utils';
import { DESCRIPTION, IMAGES, INGREDIENTS, METADATA, METHOD, TITLE } from '@/test/mock-data/recipes';

import styles from './recipe.module.scss';

const CloseIcon = ICONS.common.toggle;

interface IRecipeProps {
    recipeId: string;
    isVisible: boolean;
    isRecipeFullscreen: boolean;
    handleRecipeFullscreen: () => void;
    handleClearSelectedRecipe: () => void;
}

const Recipe: FC<IRecipeProps> = ({ isVisible, isRecipeFullscreen, handleRecipeFullscreen, handleClearSelectedRecipe }) => {
    const ref = useRef<HTMLElement>(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isPrintLayout, setIsPrintLayout] = useState(false);
    const [displayIngredients, toggleDisplayIngredients] = useToggle([true, false]);
    const [addedIngredients, setAddedIngredients] = useState(new Set<number>());
    const [isScaleIngredientsModalOpen, setIsScaleIngredientsModalOpen] = useState(false);
    const [scale, setScale] = useState(1);

    const handleEnterEditMode = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleExitEditMode = useCallback(() => {
        setIsEditing(false);
    }, []);

    const handleDiscardEditButtonClick = useCallback(() => {
        handleExitEditMode();

        createToast('info', 'Edit discarded');
    }, []);

    const handleToggleDisplayIngredients = useCallback(() => {
        toggleDisplayIngredients();
    }, []);

    const handleOpenScaleIngredientsModal = useCallback(() => {
        setIsScaleIngredientsModalOpen(true);
    }, []);

    const handleApplyIngredientsScale = useCallback(
        (multiplier: number) => () => {
            if (multiplier === scale) {
                setIsScaleIngredientsModalOpen(false);
                return;
            }

            setScale(multiplier);
            setIsScaleIngredientsModalOpen(false);

            if (multiplier !== 1) {
                createToast('info', `Scale of ${multiplier}x applied`);
            } else {
                createToast('info', 'Scale reset to original values');
            }
        },
        [scale]
    );

    const handleCloseScaleIngredientsModal = useCallback(() => {
        setIsScaleIngredientsModalOpen(false);
    }, []);

    const openPrintDialog = useReactToPrint({
        content: () => ref.current,
        onAfterPrint: () => {
            setIsPrintLayout(false);
        }
    });

    const handlePrint = useCallback(() => {
        if (!displayIngredients) {
            toggleDisplayIngredients();
        }
        setIsPrintLayout(true);
        queue(openPrintDialog);
    }, [displayIngredients]);

    const handleIngredientsClick = useCallback(
        (index: number) => () => {
            if (isEditing) return;

            const updatedSet = new Set(addedIngredients);

            if (updatedSet.has(index)) {
                updatedSet.delete(index);
            } else {
                updatedSet.add(index);
            }

            setAddedIngredients(updatedSet);
        },
        [addedIngredients, isEditing]
    );

    const { ref: intersectionRef, entry } = useIntersection({
        root: document.body,
        threshold: 1
    });

    const isBodyOnly = !entry?.isIntersecting;

    return (
        <section ref={ref} className={styles.recipe} style={{ translate: isVisible ? '0 0' : '0 100%' }}>
            <button className={styles.back} onClick={handleClearSelectedRecipe}>
                <CloseIcon />
            </button>
            <header className={styles.header}>
                <Title value={TITLE} bookmarked={false} />
                <div className={styles.divider} />
                <Description value={DESCRIPTION} />
                <div className={styles.divider} />
                <section className={styles.about}>
                    <Metadata
                        data={METADATA}
                        scale={scale}
                    />
                    <div className={styles.images}>
                        <ImageGrid
                            urls={IMAGES}
                            height={25}
                            imageSpacing={0.4}
                        />
                    </div>
                </section>
                <div ref={intersectionRef} className={formatClasses(styles, ['divider', 'delimiter'])} />
            </header>
            <section className={styles.body} data-display-ingredients={displayIngredients} data-editing={isEditing}>
                <IngredientsProvider initialState={INGREDIENTS}>
                    <MethodProvider initialState={METHOD}>
                        <>
                            <div className={styles.left}>
                                <Toolbar
                                    isEditing={isEditing}
                                    displayIngredients={displayIngredients}
                                    isFullscreen={isRecipeFullscreen}
                                    handleEnterEditMode={handleEnterEditMode}
                                    handleExitEditMode={handleExitEditMode}
                                    handleDiscardEdit={handleDiscardEditButtonClick}
                                    handleOpenScaleIngredientsModal={handleOpenScaleIngredientsModal}
                                    handleToggleDisplayIngredients={handleToggleDisplayIngredients}
                                    handleExport={() => {}}
                                    handlePrint={handlePrint}
                                    handleToggleFullscreen={handleRecipeFullscreen}
                                />
                                <ScrollWrapper
                                    className={styles.ingredientsWrapper}
                                    height={'100%'}
                                    padding={1}
                                    active={!isEditing && !isPrintLayout}
                                    isScrollable={isBodyOnly}
                                >
                                    {isEditing ? (
                                        <IngredientsEdit />
                                    ) : (
                                        <IngredientsDisplay
                                            addedIngredients={addedIngredients}
                                            scale={scale}
                                            isPrintLayout={isPrintLayout}
                                            handleIngredientsClick={handleIngredientsClick}
                                        />
                                    )}
                                </ScrollWrapper>
                            </div>
                            <ScrollWrapper
                                className={styles.methodWrapper}
                                height={'100%'}
                                padding={2}
                                active={!isEditing && !isPrintLayout}
                                isScrollable={isBodyOnly}
                            >
                                {isEditing ? <MethodEdit /> : <MethodDisplay isPrintLayout={isPrintLayout} isIngredientsVisible={displayIngredients} />}
                            </ScrollWrapper>
                            <ModalWrapper isOpen={isScaleIngredientsModalOpen} closeModal={handleCloseScaleIngredientsModal}>
                                <ScaleIngredientsModal
                                    currentMultiplier={scale}
                                    recipeYield={{
                                        quantity: [4],
                                        units: 'people'
                                    }}
                                    handleApply={handleApplyIngredientsScale}
                                    handleClose={handleCloseScaleIngredientsModal}
                                />
                            </ModalWrapper>
                        </>
                    </MethodProvider>
                </IngredientsProvider>
            </section>
        </section>
    );
};

export default Recipe;
