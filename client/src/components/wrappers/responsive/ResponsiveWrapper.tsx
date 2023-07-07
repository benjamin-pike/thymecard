import { FC, ReactElement, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface IResponsiveWrapperProps {
    children: ReactElement;
}

const RepsonsiveWrapper: FC<IResponsiveWrapperProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const currentDefaultSize = useSelector((state: RootState) => state.viewport.viewportSize);
    const currentCustomSize = useSelector((state: RootState) => state.viewport.customViewportSize);

    const handleMouseLeave = useCallback(() => {
        if (ref.current) {
            ref.current.classList.add('no-transition');
        }
    }, [ref]);

    const handleMouseEnter = useCallback(() => {
        if (ref.current) {
            ref.current.classList.remove('no-transition');
        }
    }, [ref]);

    const dataAttributes = {
        key: `${currentDefaultSize}${currentCustomSize}`,
        ref,
        'data-viewport': currentDefaultSize,
        'data-custom-viewport': currentCustomSize || undefined,
        onMouseLeave: handleMouseLeave,
        onMouseEnter: handleMouseEnter
    };

    return (
        <div {...dataAttributes}>
            {children}
        </div>
    );
}

export default RepsonsiveWrapper