import { FC, memo } from 'react';
import { LuSalad, LuBanana, LuIceCream2, LuCoffee, LuActivity, LuGlassWater, LuSoup, LuPizza } from 'react-icons/lu';
import styles from './event-icon.module.scss';
import { EventType } from '@thymecard/types';

const iconMap: Record<EventType, any> = {
    breakfast: <LuCoffee />,
    lunch: <LuPizza />,
    dinner: <LuSalad />,
    snack: <LuBanana />,
    drink: <LuGlassWater />,
    dessert: <LuIceCream2 />,
    appetizer: <LuSoup />,
    activity: <LuActivity />
};

interface IEventIconProps {
    className?: string;
    type: EventType;
    radius: number;
    background: boolean;
    dashed?: boolean;
}

const EventIcon: FC<IEventIconProps> = memo(({ className, type, radius, background, dashed }) => {
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
            data-dashed={dashed}
        >
            {iconMap[type]}
        </div>
    );
});

export default EventIcon;
