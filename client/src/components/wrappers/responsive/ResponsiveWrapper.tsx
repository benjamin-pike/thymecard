import { FC, ReactElement, useCallback, useRef } from 'react';

interface IResponsiveWrapperProps {
    children: ReactElement;
}

const RepsonsiveWrapper: FC<IResponsiveWrapperProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
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
        ref,
        className: 'responsive-wrapper',
        onMouseLeave: handleMouseLeave,
        onMouseEnter: handleMouseEnter
    };

    return <div {...dataAttributes}>{children}</div>;
};

export default RepsonsiveWrapper;
