import { FC } from 'react';
import { DateTime } from 'luxon';
import { useRecipe } from '../../RecipeProvider';
import PopoverWrapper, { PopoverPosition } from '@/components/wrappers/popover/PopoverWrapper';
import DatePicker from '@/components/common/date-picker/DatePicker';
import { ICONS } from '@/assets/icons';
import styles from './last-cooked.module.scss';

const CalendarIcon = ICONS.common.calendar;

const LastCooked: FC = () => {
    const { isEditing } = useRecipe();

    return isEditing ? <EditView /> : <DisplayView />;
};

export default LastCooked;

const EditView: FC = () => {
    const { recipe, lastCooked } = useRecipe();

    if (!recipe) {
        return null;
    }

    return (
        <>
            <div className={styles.edit}>
                <div className={styles.container}>
                    <input
                        value={lastCooked.edit?.toFormat('MMM d, yyyy') ?? ''}
                        placeholder="Log first cook . . ."
                        readOnly={!recipe.lastCooked}
                    />
                    <button data-popover-id={'popover-metadata-last-cooked'}>
                        <CalendarIcon />
                    </button>
                </div>
            </div>
            <PopoverWrapper id={'popover-metadata-last-cooked'} position={PopoverPosition.BOTTOM_LEFT} offset={10}>
                <DatePicker selectedDay={lastCooked.edit} blockFuture={true} handleSelectDay={lastCooked.handleSelect} />
            </PopoverWrapper>
        </>
    );
};

const DisplayView: FC = () => {
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    const lastCooked = recipe.lastCooked ? DateTime.fromISO(recipe.lastCooked).toFormat('MMMM d, yyyy') : null;

    return <p className={styles.value}>{lastCooked}</p>;
};
