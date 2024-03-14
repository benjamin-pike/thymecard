import { FC } from 'react';
import { DateTime } from 'luxon';
import { useRecipe } from '../../RecipeProvider';
import DatePicker from '@/components/common/date-picker/DatePicker';
import Popover, { usePopoverContext } from '@/components/wrappers/popover/Popover';
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
    const { handleSelect } = lastCooked;

    const handleSelectDay = (day: DateTime) => {
        handleSelect(day);
    };

    return (
        <>
            <div className={styles.edit}>
                <Popover
                    content={<DatePicker selectedDay={lastCooked.edit ?? undefined} blockFuture={true} handleSelectDay={handleSelectDay} />}
                    placement="bottom"
                >
                    <div className={styles.container}>
                        <input
                            className={styles.input}
                            value={lastCooked.edit?.toFormat('MMM d, yyyy') ?? ''}
                            placeholder="Log first cook . . ."
                            readOnly={!recipe.lastCooked}
                        />

                        <button className={styles.button}>
                            <CalendarIcon />
                        </button>
                    </div>
                </Popover>
            </div>
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
