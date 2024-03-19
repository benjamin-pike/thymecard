import { FC, memo } from 'react';
import { LuSalad, LuBanana, LuIceCream2, LuCoffee, LuActivity, LuGlassWater, LuSoup, LuLeafyGreen } from 'react-icons/lu';
import { EEventType } from '@thymecard/types';
import styles from './event-icon.module.scss';

const iconMap: Record<EEventType, any> = {
    [EEventType.BREAKFAST]: <LuCoffee />,
    [EEventType.LUNCH]: <LuSoup />,
    [EEventType.DINNER]: <LuSalad />,
    [EEventType.SNACK]: <LuBanana />,
    [EEventType.DRINK]: <LuGlassWater />,
    [EEventType.DESSERT]: <LuIceCream2 />,
    [EEventType.APPETIZER]: <LuLeafyGreen />,
    [EEventType.ACTIVITY]: <LuActivity />
};

interface IEventIconProps {
    className?: string;
    type: EEventType;
    radius: number;
    background: boolean;
    dashed?: boolean;
}

const EventIcon: FC<IEventIconProps> = memo(({ className, type, radius, background, dashed }) => {
    return (
        <div
            className={`${styles.icon}${className ? ' ' + className : ''}`}
            data-event={type}
            style={{
                width: radius * 2 + 'rem',
                height: radius * 2 + 'rem',
                padding: background ? radius * 0.5 + 'rem' : 0
            }}
            data-background={background}
            data-dashed={dashed}
        >
            {iconMap[type]}
        </div>
    );
});

export default EventIcon;
