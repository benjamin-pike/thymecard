import { ICONS } from "@/assets/icons";

const StarEmptyIcon = ICONS.common.star;
const StarHalfIcon = ICONS.common.starHalfFill;
const StarFullIcon = ICONS.common.starFill;

export const numberToStars = (num: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
        if (num >= i + 1) {
            return <StarFullIcon key={i} />;
        } else if (num >= i + 0.5) {
            return <StarHalfIcon key={i} />;
        } else {
            return <StarEmptyIcon key={i} />;
        }
    });
}