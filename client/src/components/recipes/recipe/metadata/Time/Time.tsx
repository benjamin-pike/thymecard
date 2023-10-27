import { FC } from 'react';
import styles from './time.module.scss';
import { useRecipe } from '../../RecipeProvider';
import { Duration } from 'luxon';

interface ITimeProps {
    type: 'prep' | 'cook' | 'total';
}

const Time: FC<ITimeProps> = ({ type }) => {
    const { recipe, isEditing } = useRecipe();

    const time = (() => {
        switch (type) {
            case 'prep':
                return recipe?.prepTime;
            case 'cook':
                return recipe?.cookTime;
            case 'total':
                return recipe?.totalTime;
        }
    })();

    if (!recipe || (!isEditing && !time)) {
        return null;
    }

    return isEditing ? <EditView type={type} /> : <DisplayView time={time} />;
};

export default Time;

const EditView: FC<ITimeProps> = ({ type }) => {
    const { time } = useRecipe();

    return (
        <div className={styles.edit}>
            <div className={styles.hours}>
                <input
                    type="number"
                    value={time.edit[type]?.hours}
                    min={0}
                    max={99}
                    placeholder="#"
                    onChange={time.handleHoursChange(type)}
                />
                <p>hours</p>
            </div>
            <div className={styles.minutes}>
                <input
                    type="number"
                    value={time.edit[type]?.minutes}
                    min={0}
                    max={59}
                    placeholder="#"
                    onChange={time.handleMinutesChange(type)}
                />
                <p>minutes</p>
            </div>
        </div>
    );
};

interface IDisplayViewProps {
    time: number | undefined;
}

const DisplayView: FC<IDisplayViewProps> = ({ time }) => {
    const formattedTime = (() => {
        if (!time) {
            return null;
        }
        if (time < 60) {
            return `${time} minutes`;
        }
        if (time < 120) {
            return Duration.fromObject({ minutes: time }).toFormat("h 'hour,'  m 'minutes'").replace(',  0 minutes', '');
        }

        return Duration.fromObject({ minutes: time }).toFormat("h 'hours,'  m 'minutes'").replace(',  0 minutes', '');
    })();

    return <p className={styles.value}>{formattedTime}</p>;
};
