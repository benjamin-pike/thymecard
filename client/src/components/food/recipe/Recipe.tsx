import { FC, useCallback, useRef, useState } from 'react';
import { useIntersection, useToggle } from '@mantine/hooks';
import { useReactToPrint } from 'react-to-print';

import Title from './title/Title';
import Description from './description/Description';
import Metadata from './metadata/Metadata';
import Image from './image/Image';
import Toolbar from './toolbar/Toolbar';
import IngredientsEdit from './ingredients/IngredientsEdit';
import IngredientsDisplay from './ingredients/IngredientsDisplay';
import ScaleIngredientsModal from './scale-ingredients-modal/ScaleIngredientsModal';
import MethodDisplay from './method/MethodDisplay';
import MethodEdit from './method/MethodEdit';
import CommentsEdit from './comments/CommentsEdit';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import ModalWrapper from '@/components/wrappers/modal/ModalWrapper';

import { useModal } from '@/hooks/common/useModal';
import { useRecipe } from './RecipeProvider';
import { IViewport } from '@/hooks/common/useBreakpoints';

import { formatClasses, queue } from '@/lib/common.utils';
import { createToast } from '@/lib/toast/toast.utils';

import styles from './recipe.module.scss';

interface IRecipeProps {
    viewport: IViewport;
    isRecipeFullscreen: boolean;
    handleRecipeFullscreen: () => void;
    handleClearSelectedRecipe: () => void;
}

const Recipe: FC<IRecipeProps> = ({ viewport, isRecipeFullscreen, handleRecipeFullscreen, handleClearSelectedRecipe }) => {
    const { recipe, isEditing, handleDeleteRecipe } = useRecipe();

    const sectionRef = useRef<HTMLElement>(null);

    const [isPrintLayout, setIsPrintLayout] = useState(false);
    const [displayIngredients, toggleDisplayIngredients] = useToggle([true, false]);
    const [addedIngredients, setAddedIngredients] = useState(new Set<number>());
    const [scale, setScale] = useState(1);

    const {
        modalState: scaleIngredientsModalState,
        openModal: openScaleIngredientsModal,
        closeModal: closeScaleIngredientsModal
    } = useModal();

    const handleToggleDisplayIngredients = useCallback(() => {
        toggleDisplayIngredients();
    }, [toggleDisplayIngredients]);

    const handleOpenScaleIngredientsModal = useCallback(() => {
        openScaleIngredientsModal();
    }, [openScaleIngredientsModal]);

    const handleApplyIngredientsScale = useCallback(
        (multiplier: number) => () => {
            if (multiplier === scale) {
                closeScaleIngredientsModal();
                return;
            }

            setScale(multiplier);
            closeScaleIngredientsModal();

            if (multiplier !== 1) {
                createToast('info', `Scale of ${multiplier}x applied`);
            } else {
                createToast('info', 'Scale reset to original values');
            }
        },
        [closeScaleIngredientsModal, scale]
    );

    const handleCloseScaleIngredientsModal = useCallback(() => {
        closeScaleIngredientsModal();
    }, [closeScaleIngredientsModal]);

    const openPrintDialog = useReactToPrint({
        content: () => sectionRef.current,
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
    }, [displayIngredients, openPrintDialog, toggleDisplayIngredients]);

    const handleDeleteRecipeButtonClick = useCallback(async () => {
        try {
            await handleDeleteRecipe();
            handleClearSelectedRecipe();
        } catch (err) {
            createToast('error', 'Failed to delete recipe');
        }
    }, [handleDeleteRecipe, handleClearSelectedRecipe]);

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

    const isLoading = !recipe;

    return (
        <section ref={sectionRef} className={styles.recipe}>
            {/* <button className={styles.back} onClick={handleClearSelectedRecipe}>
                <CloseIcon />
            </button> */}
            <header className={styles.header}>
                <Title />
                <div className={styles.divider} />
                <Description />
                {(isEditing || isLoading || recipe?.description) && <div className={styles.divider} />}
                <section className={styles.about}>
                    <div className={styles.left}>
                        <Metadata scale={scale} />
                    </div>
                    <div className={styles.right}>
                        <Image />
                        {isEditing && <CommentsEdit />}
                    </div>
                </section>
                <div ref={intersectionRef} className={formatClasses(styles, ['divider', 'delimiter'])} />
            </header>
            <section className={styles.body} data-display-ingredients={displayIngredients} data-editing={isEditing}>
                <>
                    <div className={styles.left}>
                        <Toolbar
                            isEditing={isEditing}
                            displayIngredients={displayIngredients}
                            isFullscreen={isRecipeFullscreen}
                            handleOpenScaleIngredientsModal={handleOpenScaleIngredientsModal}
                            handleToggleDisplayIngredients={handleToggleDisplayIngredients}
                            handleExport={() => console.log('export')}
                            handlePrint={handlePrint}
                            handleToggleFullscreen={handleRecipeFullscreen}
                            handleDeleteRecipe={handleDeleteRecipeButtonClick}
                        />
                        <ScrollWrapper
                            className={styles.ingredientsWrapper}
                            height={'100%'}
                            padding={1}
                            active={
                                !isEditing &&
                                !isPrintLayout &&
                                !viewport.current.isOneColumnWideMargins &&
                                !viewport.current.isOneColumnNarrowMargins
                            }
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
                    <div className={styles.right}>
                        <ScrollWrapper
                            className={styles.methodWrapper}
                            height={'100%'}
                            padding={displayIngredients ? 2 : 0.5}
                            active={
                                !isEditing &&
                                !isPrintLayout &&
                                !viewport.current.isOneColumnWideMargins &&
                                !viewport.current.isOneColumnNarrowMargins
                            }
                            isScrollable={isBodyOnly}
                        >
                            <>
                                {!isEditing && scale !== 1 && (
                                    <p className={styles.scaleWarning} data-ingredients-visible={displayIngredients}>
                                        <strong>Note</strong> – A scale of <span>{scale}x</span> has been applied to the ingredients. Any
                                        measurements in the <span>method</span> and <span>ingredient notes</span> have not been scaled
                                    </p>
                                )}
                                {isEditing ? (
                                    <MethodEdit />
                                ) : (
                                    <MethodDisplay isPrintLayout={isPrintLayout} isIngredientsVisible={displayIngredients} />
                                )}
                            </>
                        </ScrollWrapper>
                    </div>

                    <ModalWrapper
                        state={scaleIngredientsModalState}
                        handleCloseModal={handleCloseScaleIngredientsModal}
                        blurBackground={true}
                    >
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
            </section>
        </section>
    );
};

export default Recipe;