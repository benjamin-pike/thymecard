import { FC } from 'react';
import { EventType } from '@/lib/global.types';
import { LuSalad, LuBanana, LuIceCream2, LuCoffee, LuActivity, LuGlassWater, LuSoup } from 'react-icons/lu';
import styles from './event-icon.module.scss';

const iconMap: Record<EventType, any> = {
    breakfast: <LuCoffee />,
    lunch: <LuSoup />,
    dinner: <LuSalad />,
    snack: <LuBanana />,
    drink: <LuGlassWater />,
    dessert: <LuIceCream2 />,
    activity: <LuActivity />
}

interface IEventIconProps {
    className?: string;
    type: EventType;
    radius: number;
    background: boolean;
}

const EventIcon: FC<IEventIconProps> = ({ className, type, radius, background }) => {
    return (
        <div
            className={`${styles.icon}${className ? ' ' + className : ''}`}
            data-event={type.toLowerCase()}
            style={{
                width: radius * 2 + 'rem',
                height: radius * 2 + 'rem',
                padding: background ? radius * 0 + 'rem' : 0
            }}
            data-background={background}
        >
            {iconMap[type]}
        </div>
    );
};

export default EventIcon;
