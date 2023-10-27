import { FC, Fragment, useMemo } from 'react';
import { useRecipe } from '../RecipeProvider';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { ICONS } from '@/assets/icons';
import styles from './toolbar.module.scss';
import { buildKey } from '@sirona/utils';

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
    handleOpenScaleIngredientsModal: () => void;
    handleToggleDisplayIngredients: () => void;
    handleExport: () => void;
    handlePrint: () => void;
    handleToggleFullscreen: () => void;
    handleDeleteRecipe: () => void;
}

const Toolbar: FC<IToolbarProps> = ({
    isEditing,
    displayIngredients,
    isFullscreen,
    handleOpenScaleIngredientsModal,
    handleToggleDisplayIngredients,
    handleExport,
    handlePrint,
    handleToggleFullscreen,
    handleDeleteRecipe
}) => {
    const { toggleEditing, handleSaveEdit, handleCancelEdit } = useRecipe();

    const buttons: IButton[] = useMemo(
        () => [
            {
                icon: <EditIcon />,
                name: 'edit',
                tooltip: 'Edit Recipe',
                isActive: false,
                mode: ['view'],
                onClick: toggleEditing
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
                onClick: handleCancelEdit
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
                onClick: () => console.log('add to planner')
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
                onClick: handleDeleteRecipe
            }
        ],
        [
            toggleEditing,
            handleSaveEdit,
            handleOpenScaleIngredientsModal,
            displayIngredients,
            handleToggleDisplayIngredients,
            handleExport,
            handlePrint,
            isFullscreen,
            handleToggleFullscreen,
            handleDeleteRecipe
        ]
    );

    return (
        <section className={styles.toolbar}>
            {buttons.map(
                (button) =>
                    ((!isEditing && button.mode.includes('view')) || (isEditing && button.mode.includes('edit'))) && (
                        <Fragment key={buildKey('toolbar', button.name)}>
                            <button
                                className={styles[button.name]}
                                data-tooltip-id={`recipe-${button.name}`}
                                data-tooltip-content={button.isActive ? button.activeTooltip ?? button.tooltip : button.tooltip}
                                onClick={button.onClick}
                            >
                                {button.isActive ? button.activeIcon ?? button.icon : button.icon}
                            </button>
                            <Tooltip id={`recipe-${button.name}`} place="bottom" size="small" />
                        </Fragment>
                    )
            )}
        </section>
    );
};

export default Toolbar;
