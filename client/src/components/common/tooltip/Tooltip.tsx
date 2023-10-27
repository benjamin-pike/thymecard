import { FC } from 'react';
import { Tooltip } from 'react-tooltip';
import styles from './tooltip.module.scss';

interface ICustomTooltipProps extends PropsOf<typeof Tooltip> {
    size?: 'small' | 'medium' | 'large';
}

const CustomTooltip: FC<ICustomTooltipProps> = ({ className, place, children, size, ...props }) => {
    let extendedClassName = styles.tooltip;

    if (className) extendedClassName += ` ${className}`;
    if (place) extendedClassName += ` ${styles[`tooltip-place-${place}`]}`;
    if (size) extendedClassName += ` ${styles[`tooltip-font-size-${size}`]}`;

    return (
        <Tooltip className={extendedClassName} place={place ?? 'bottom'} {...props}>
            {children}
        </Tooltip>
    );
};

export default CustomTooltip;
