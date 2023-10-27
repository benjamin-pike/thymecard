import Search from '../search/Search';
import styles from './create-bar.module.scss';
import { useCallback, useState } from 'react';
import Tooltip from '@/components/common/tooltip/Tooltip';
import usePremium from '@/hooks/common/usePremium';
import { ICONS } from '@/assets/icons';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useRecipe } from '../recipe/RecipeProvider';

const LinkIcon = ICONS.recipes.link;
const CreateIcon = ICONS.recipes.create;
const ChefIcon = ICONS.recipes.chef;
const DuplicateIcon = ICONS.recipes.duplicate;
const UploadIcon = ICONS.recipes.upload;
const AddRecipeIcon = ICONS.recipes.add;

const CreateBar = () => {
    const { parseRecipe, createRecipePartial } = useRecipe();
    const isPremium = usePremium();
    const { viewportSize, customViewportSize } = useSelector((state: RootState) => state.viewport);

    const [value, setValue] = useState('');

    const condenseButtons = customViewportSize === 'listOnly';
    const displayChefButton = isPremium && viewportSize !== 'mobile';
    const tooltipPosition = customViewportSize === 'listPlus' || customViewportSize === 'listOnly' ? 'top' : 'bottom';

    const create = useCallback(() => {
        createRecipePartial({});
    }, [createRecipePartial]);

    const parse = useCallback(() => {
        parseRecipe(value);
    }, [parseRecipe, value]);

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
                primaryPlaceholder="Import"
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
                <>
                    <button data-tooltip-id="add-manually" onClick={create}>
                        <CreateIcon />
                    </button>
                    <div className={styles.divider} />
                    <button data-tooltip-id="import-file">
                        <UploadIcon />
                    </button>
                    <div className={styles.divider} />
                    <button data-tooltip-id="duplicate-existing">
                        <DuplicateIcon />
                    </button>
                </>
            )}

            <Tooltip id="chef" place={tooltipPosition} offset={17.5}>
                Create with Chef AI
            </Tooltip>
            <Tooltip id="add-manually" place={tooltipPosition} offset={17.5}>
                Add Manually
            </Tooltip>
            <Tooltip id="import-file" place={tooltipPosition} offset={17.5}>
                Import from File
            </Tooltip>
            <Tooltip id="duplicate-existing" place={tooltipPosition} offset={17.5}>
                Duplicate Existing
            </Tooltip>
            <Tooltip id="add" place={tooltipPosition} offset={17.5}>
                Add Recipe
            </Tooltip>
        </section>
    );
};

export default CreateBar;
