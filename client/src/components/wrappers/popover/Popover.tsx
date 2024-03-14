import { useState, ReactElement, FC, useCallback, useEffect, createContext, useContext } from 'react';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import styles from './popover.module.scss';

interface IPopoverContext {
    handleClosePopover: () => void;
}

const PopoverContext = createContext<IPopoverContext>({
    handleClosePopover: () => {
        throw new Error('Context incorrectly initialized');
    }
});

export const usePopoverContext = () => useContext(PopoverContext);

interface IPopoverProps {
    className?: string;
    children: ReactElement;
    content: ReactElement | null;
    placement?: Placement;
    strategy?: 'fixed' | 'absolute';
}

const Popover: FC<IPopoverProps> = ({ className, children, content, placement, strategy }) => {
    const [state, setState] = useState<'open' | 'closing' | 'closed'>('closed');

    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

    const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
        placement: placement ?? 'auto',
        strategy: strategy ?? 'absolute',
        modifiers: [
            { name: 'preventOverflow', options: { boundary: 'clippingParents' } },
            { name: 'flip', options: { fallbackPlacements: ['bottom'] } }
        ]
    });

    const handleOpenPopover = useCallback(() => {
        setState('open');
    }, []);

    const handleClosePopover = useCallback(() => {
        if (state !== 'open') {
            return;
        }

        setState('closing');

        setTimeout(() => {
            setState('closed');
        }, 200);
    }, [state]);

    const containerRef = useClickOutside<HTMLDivElement>(handleClosePopover);

    useEffect(() => {
        if (!content && state === 'open') {
            handleClosePopover();
        }
    }, [content, handleClosePopover, state]);

    return (
        <PopoverContext.Provider value={{ handleClosePopover }}>
            <div ref={containerRef} className={styles.container + className ? ` ${className}` : ''}>
                <div ref={setReferenceElement} className={styles.popoverTrigger} onClick={handleOpenPopover}>
                    {children}
                </div>
                {state !== 'closed' && content && (
                    <div ref={setPopperElement} className={styles.wrapper} style={popperStyles.popper} {...attributes.popper}>
                        <div className={styles.container} data-state={state}>
                            {content}
                        </div>
                    </div>
                )}
            </div>
        </PopoverContext.Provider>
    );
};

export default Popover;
