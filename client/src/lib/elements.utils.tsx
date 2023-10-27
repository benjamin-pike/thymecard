import { ICONS } from '@/assets/icons';

export const numberToStars = (num: number) => {
    const StarEmptyIcon = ICONS.common.star;
    const StarHalfIcon = ICONS.common.starHalfFill;
    const StarFullIcon = ICONS.common.starFill;

    return Array.from({ length: 5 }).map((_, i) => {
        if (num >= i + 1) {
            return (props: PropsOf<typeof StarEmptyIcon>) => <StarFullIcon key={i} {...props} />;
        } else if (num >= i + 0.5) {
            return (props: PropsOf<typeof StarHalfIcon>) => <StarHalfIcon key={i} {...props} />;
        } else {
            return (props: PropsOf<typeof StarEmptyIcon>) => <StarEmptyIcon key={i} {...props} />;
        }
    });
};
