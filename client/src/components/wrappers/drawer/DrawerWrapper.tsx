import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { createPortal } from 'react-dom';
import { useEventListener } from '@/hooks/common/useEventListener';
import { useSuppressTransitionsOnMount } from '@/hooks/common/useSuppressTransitionsOnMount';
import styles from './drawer-wrapper.module.scss';
import { capitalize } from '@/lib/string.utils';

export interface IDrawerWrapperProps {
    children: ReactElement;
    direction: 'top' | 'bottom' | 'left' | 'right';
    transitionDuration: number;
    margin?: { closed: number; open: number };
    isVisible: boolean;
    isActive: boolean;
    closeDrawer: () => void;
}

const DrawerWrapper: FC<IDrawerWrapperProps> = ({ children, direction, transitionDuration, margin, isVisible, isActive, closeDrawer }) => {
    const [isRendered, setIsRendered] = useState(false);
    const root = document.getElementById('drawer-root');

    useEffect(() => {
        if (!isRendered) {
            setIsRendered(true);
        }
    }, [isRendered]);

    const containerRef = useSuppressTransitionsOnMount();
    const backdropRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            if (e.target !== e.currentTarget) {
                return;
            }

            closeDrawer();
        },
        [closeDrawer]
    );

    useWindowKeyDown('Escape', closeDrawer);
    useEventListener('click', handleClickOutside, containerRef);
    useEventListener('click', handleClickOutside, backdropRef);

    if (!isActive) {
        return children;
    }

    const currentMargin = margin?.[isVisible ? 'open' : 'closed'] ?? 0;

    if (!isRendered || !root) {
        return null;
    }

    return createPortal(
        <div key={direction} className={styles.wrapper}>
            <div ref={backdropRef} className={`${styles.backdrop} ${isVisible ? styles.visible : ''}`} onClick={closeDrawer} />
            <div
                ref={containerRef}
                className={`${styles.drawer} ${styles[direction]} ${isVisible ? styles.visible : ''}`}
                style={{
                    [`margin${capitalize(direction)}`]: `${currentMargin}rem`,
                    transitionDuration: `${transitionDuration}ms`
                }}
            >
                {children}
            </div>
        </div>,
        root
    );
};

export default DrawerWrapper;
