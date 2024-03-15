import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Search from '../search/Search';
import Tooltip from '@/components/common/tooltip/Tooltip';
import { RootState } from '@/store';
import usePremium from '@/hooks/common/usePremium';
import { useRecipe } from '../../providers/RecipeProvider';
import { ICONS } from '@/assets/icons';
import styles from './create-bar.module.scss';

const LinkIcon = ICONS.recipes.link;
const CreateIcon = ICONS.recipes.add;
const ChefIcon = ICONS.recipes.chef;
const AddRecipeIcon = ICONS.recipes.add;

const CreateBar = () => {
    const { handleParseRecipe, handleManualCreate } = useRecipe();
    const isPremium = usePremium();
    const { viewportSize, customViewportSize } = useSelector((state: RootState) => state.viewport);

    const [value, setValue] = useState('');

    const condenseButtons = customViewportSize === 'oneColumnNarrowMargins' || customViewportSize === 'oneColumnWideMargins';
    const displayChefButton = isPremium && viewportSize !== 'mobile';
    const tooltipPosition =
        customViewportSize === 'twoColumns' ||
        customViewportSize === 'oneColumnNarrowMargins' ||
        customViewportSize === 'oneColumnWideMargins'
            ? 'top'
            : 'bottom';

    const parse = useCallback(() => {
        handleParseRecipe(value);
    }, [handleParseRecipe, value]);

    return (
        <section className={styles.createBar}>
            {displayChefButton && (
                <>
                    <button data-tooltip-id="chef">
                        <ChefIcon />
                    </button>
                    <div className={styles.divider} />
                </>
            )}
            <Search
                primaryPlaceholder="Import recipe"
                secondaryPlaceholder="from website . . ."
                icon={<LinkIcon className={styles.searchIcon} />}
                value={value}
                setValue={setValue}
                goFn={parse}
            />
            <div className={styles.divider} />
            {condenseButtons ? (
                <button data-tooltip-id="add">
                    <AddRecipeIcon />
                </button>
            ) : (
                <button data-tooltip-id="add-manually" onClick={handleManualCreate}>
                    <CreateIcon />
                </button>
            )}
            <Tooltip id="chef" place={tooltipPosition} offset={17.5}>
                Create with Chef AI
            </Tooltip>
            <Tooltip id="add-manually" place={tooltipPosition} offset={17.5}>
                Add Recipe Manually
            </Tooltip>
            <Tooltip id="add" place={tooltipPosition} offset={17.5}>
                Add Recipe
            </Tooltip>
        </section>
    );
};

export default CreateBar;
