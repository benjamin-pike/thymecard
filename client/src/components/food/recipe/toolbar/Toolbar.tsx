import { FC, Fragment, useMemo } from 'react';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { useRecipe } from '../RecipeProvider';
import { ICONS } from '@/assets/icons';
import { buildKey } from '@thymecard/utils';
import styles from './toolbar.module.scss';

const EditIcon = ICONS.common.pen;
const SaveIcon = ICONS.common.tick;
const DiscardIcon = ICONS.common.XLarge;
const IngredientsIcon = ICONS.recipes.ingredients;
const PlannerIcon = ICONS.common.planner;
const ExportIcon = ICONS.recipes.export;
const PrintIcon = ICONS.recipes.print;
const FullscreenIcon = ICONS.common.enterFullscreen;
const FullscreenExitIcon = ICONS.common.exitFullscreen;
const DeleteIcon = ICONS.common.delete;

const AddIcon = ICONS.common.plus;
const MinusIcon = ICONS.common.minus;

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
    servings: number;
    handleToggleDisplayIngredients: () => void;
    handleExport: () => void;
    handlePrint: () => void;
    handleToggleFullscreen: () => void;
    handleServingsChange: (mode: 'INCREASE' | 'DECREASE') => () => void;
    handleDeleteRecipe: () => void;
}

const Toolbar: FC<IToolbarProps> = ({
    isEditing,
    displayIngredients,
    isFullscreen,
    servings,
    handleToggleDisplayIngredients,
    handleExport,
    handlePrint,
    handleToggleFullscreen,
    handleServingsChange,
    handleDeleteRecipe
}) => {
    const { toggleEditing, handleSaveRecipe, handleCancelEdit } = useRecipe();

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
                onClick: handleSaveRecipe
            },
            {
                icon: <DiscardIcon />,
                name: 'discard',
                tooltip: 'Discard Changes',
                mode: ['edit'],
                onClick: handleCancelEdit
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
            }
        ],
        [
            toggleEditing,
            handleSaveRecipe,
            handleCancelEdit,
            displayIngredients,
            handleToggleDisplayIngredients,
            handleExport,
            handlePrint,
            isFullscreen,
            handleToggleFullscreen
        ]
    );

    return (
        <section className={styles.toolbar} data-editing={isEditing}>
            {buttons.map(
                (button) =>
                    ((!isEditing && button.mode.includes('view')) || (isEditing && button.mode.includes('edit'))) && (
                        <Fragment key={buildKey('toolbar', button.name)}>
                            <button
                                className={styles.toolbarButton}
                                data-button={button.name}
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
            {!isEditing && (
                <>
                    <div className={styles.scale}>
                        <button className={styles.decrease} onClick={handleServingsChange('DECREASE')}>
                            <MinusIcon />
                        </button>
                        <input value={servings} style={{ width: `${servings.toString().length}ch` }} />
                        <button className={styles.increase} onClick={handleServingsChange('INCREASE')}>
                            <AddIcon />
                        </button>
                    </div>
                    <Fragment key={buildKey('toolbar', 'delete')}>
                        <button
                            className={styles.toolbarButton}
                            data-button={'delete'}
                            data-tooltip-id={`recipe-delete`}
                            data-tooltip-content={'Delete Recipe'}
                            onClick={handleDeleteRecipe}
                        >
                            <DeleteIcon />
                        </button>
                        <Tooltip id={`recipe-delete`} place="bottom" size="small" />
                    </Fragment>
                </>
            )}
        </section>
    );
};

export default Toolbar;
