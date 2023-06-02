import { FC } from 'react';
import { formatClasses } from '@/lib/common.utils';
import { EventType } from '../dashboard.types';
import BreakfastIcon from '@/assets/breakfast.svg';
import LunchIcon from '@/assets/lunchv2.svg';
import DinnerIcon from '@/assets/dinner.svg';
import HeartIcon from '@/assets/heart.svg';
import styles from './event-icon.module.css';

const iconMap: Record<EventType, any> = {
    Breakfast: <BreakfastIcon />,
    Lunch: <LunchIcon />,
    Dinner: <DinnerIcon />,
    Walk: <HeartIcon />
};

interface IEventIconProps {
    className?: string;
    type: EventType;
    radius: number;
    background: boolean;
}

const EventIcon: FC<IEventIconProps> = ({ className, type, radius, background }) => {
    return (
        <div
            className={`${formatClasses(styles, ['icon', type.toLowerCase()])}${className ? ' ' + className : ''}`}
            style={{
                width: radius * 2 + 'rem',
                height: radius * 2 + 'rem',
                padding: background ? radius * 0.55 + 'rem' : 0
            }}
            data-background={background}
        >
            {iconMap[type]}
        </div>
    );
};

export default EventIcon;
