import { FC, useCallback, useMemo } from 'react';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { ICONS } from '@/assets/icons';
import { useIngredients } from '../ingredients/IngredientsProvider';
import { useMethod } from '../method/MethodProvider';
import { createToast } from '@/lib/toast/toast.utils';
import styles from './toolbar.module.scss';

const EditIcon = ICONS.common.pen;
const SaveIcon = ICONS.common.tick;
const DiscardIcon = ICONS.common.XLarge;
const ScalesIcon = ICONS.recipes.scales;
const IngredientsIcon = ICONS.recipes.ingredients;
const PlannerIcon = ICONS.common.planner;
const ExportIcon = ICONS.recipes.export;
const PrintIcon = ICONS.recipes.print;
const FullscreenIcon = ICONS.common.enterFullscreen;
const FullscreenExitIcon = ICONS.common.exitFullscreen;
const DeleteIcon = ICONS.common.delete;

interface IButton {
    icon: JSX.Element;
    name: string;
    tooltip: string;
    isActive?: boolean;
    activeIcon?: JSX.Element;
    activeTooltip?: string;
    mode: ('view' | 'edit')[];
    onClick: () => void;
}

interface IToolbarProps {
    isEditing: boolean;
    displayIngredients: boolean;
    isFullscreen: boolean;
    handleEnterEditMode: () => void;
    handleExitEditMode: () => void;
    handleDiscardEdit: () => void;
    handleOpenScaleIngredientsModal: () => void;
    handleToggleDisplayIngredients: () => void;
    handleExport: () => void;
    handlePrint: () => void;
    handleToggleFullscreen: () => void;
}

const Toolbar: FC<IToolbarProps> = ({
    isEditing,
    displayIngredients,
    isFullscreen,
    handleEnterEditMode,
    handleExitEditMode,
    handleDiscardEdit,
    handleOpenScaleIngredientsModal,
    handleToggleDisplayIngredients,
    handleExport,
    handlePrint,
    handleToggleFullscreen
}) => {
    const { saveIngredients, validateIngredients } = useIngredients();
    const { saveMethod, validateMethod } = useMethod();

    const handleSaveEdit = useCallback(() => {
        if (!validateIngredients() || !validateMethod()) {
            return;
        }

        saveIngredients();
        saveMethod();
        handleExitEditMode();

        createToast('success', 'Recipe updated successfully');
    }, [saveIngredients, saveMethod, handleExitEditMode]);

    const buttons: IButton[] = useMemo(
        () => [
            {
                icon: <EditIcon />,
                name: 'edit',
                tooltip: 'Edit Recipe',
                isActive: false,
                mode: ['view'],
                onClick: handleEnterEditMode
            },
            {
                icon: <SaveIcon />,
                name: 'save',
                tooltip: 'Save Changes',
                mode: ['edit'],
                onClick: handleSaveEdit
            },
            {
                icon: <DiscardIcon />,
                name: 'discard',
                tooltip: 'Discard Changes',
                mode: ['edit'],
                onClick: handleDiscardEdit
            },
            {
                icon: <ScalesIcon />,
                name: 'scale',
                tooltip: 'Scale Ingredients',
                isActive: false,
                mode: ['view'],
                onClick: handleOpenScaleIngredientsModal
            },
            {
                icon: <IngredientsIcon />,
                name: 'displayIngredients',
                tooltip: 'Display Ingredients',
                isActive: displayIngredients,
                activeTooltip: 'Hide Ingredients',
                mode: ['view'],
                onClick: handleToggleDisplayIngredients
            },
            {
                icon: <PlannerIcon />,
                name: 'addToPlanner',
                tooltip: 'Add to Planner',
                mode: ['view'],
                onClick: () => {}
            },
            {
                icon: <ExportIcon />,
                name: 'export',
                tooltip: 'Export Recipe',
                mode: ['view'],
                onClick: handleExport
            },
            {
                icon: <PrintIcon />,
                name: 'print',
                tooltip: 'Print Recipe or Save as PDF',
                mode: ['view'],
                onClick: handlePrint
            },
            {
                icon: <FullscreenIcon />,
                name: 'fullscreen',
                tooltip: 'Fullscreen',
                isActive: isFullscreen,
                activeIcon: <FullscreenExitIcon />,
                activeTooltip: 'Exit Fullscreen',
                mode: ['view', 'edit'],
                onClick: handleToggleFullscreen
            },
            {
                icon: <DeleteIcon />,
                name: 'delete',
                tooltip: 'Delete Recipe',
                mode: ['view'],
                onClick: () => {}
            }
        ],
        [displayIngredients, isFullscreen, handleSaveEdit]
    );

    return (
        <section className={styles.toolbar}>
            {buttons.map(
                (button) =>
                    ((!isEditing && button.mode.includes('view')) || (isEditing && button.mode.includes('edit'))) && (
                        <>
                            <button
                                className={styles[button.name]}
                                data-tooltip-id={`recipe-${button.name}`}
                                data-tooltip-content={button.isActive ? button.activeTooltip ?? button.tooltip : button.tooltip}
                                onClick={button.onClick}
                            >
                                {button.isActive ? button.activeIcon ?? button.icon : button.icon}
                            </button>
                            <Tooltip id={`recipe-${button.name}`} place="bottom" size="small" />
                        </>
                    )
            )}
        </section>
    );
};

export default Toolbar;
