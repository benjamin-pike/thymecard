import { FC, ReactElement, ReactNode, useCallback, useState } from 'react';
import styles from './popover-wrapper.module.scss';
import { useClickOutside } from '@/hooks/dom/useClickOutside';
import { useDocumentEventListener } from '@/hooks/events/useDocumentEventListener';

export enum PopoverPosition {
    TOP_LEFT = 'TOP_LEFT',
    TOP_RIGHT = 'TOP_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT'
}

interface IPopoverWrapperProps {
    children: ReactNode;
    id: string;
    position: PopoverPosition;
    offset?: number;
    tooltip?: ReactElement;
}

const PopoverWrapper: FC<IPopoverWrapperProps> = ({ id, position, children, offset, tooltip }) => {
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [state, setState] = useState<'open' | 'closing' | 'closed'>('closed');

    const handleClickOutside = (e: MouseEvent) => {
        const clickedElement = e.target as HTMLElement;
        const triggerElement = findAncestorWithAttribute(clickedElement, 'data-popover-id', id);

        if (triggerElement) {
            return;
        }

        setState('closing');

        setTimeout(() => {
            setState('closed');
        }, 200);
    };

    const popoverRef = useClickOutside<HTMLDivElement>(handleClickOutside);

    const handleMove = useCallback(
        (trigger: HTMLElement, popover: HTMLElement, positioningContext: HTMLElement) => {
            const triggerRect = trigger.getBoundingClientRect();
            const positioningContextRect = positioningContext.getBoundingClientRect();

            const containerScrollTop = positioningContext.scrollTop || document.documentElement.scrollTop;
            const containerScrollLeft = positioningContext.scrollLeft || document.documentElement.scrollLeft;

            let top = 0;
            let left = 0;

            const triggerTop = triggerRect.top + containerScrollTop - positioningContextRect.top;
            const triggerLeft = triggerRect.left + containerScrollLeft - positioningContextRect.left;

            switch (position) {
                case 'TOP_LEFT':
                    top = triggerTop - (offset || 0);
                    left = triggerLeft + triggerRect.width - popover.clientWidth;
                    break;
                case 'TOP_RIGHT':
                    top = triggerTop - (offset || 0);
                    left = triggerLeft;
                    break;
                case 'BOTTOM_RIGHT':
                    top = triggerTop + triggerRect.height + (offset || 0);
                    left = triggerLeft;
                    break;
                case 'BOTTOM_LEFT':
                    top = triggerTop + triggerRect.height + (offset || 0);
                    left = triggerLeft + triggerRect.width;
                    break;
            }

            setPopoverPosition({ top, left });
        },
        [position, offset]
    );

    const handleClick = useCallback(
        (e: MouseEvent) => {
            const clickedElement = e.target as HTMLElement;
            const triggerElement = findAncestorWithAttribute(clickedElement, 'data-popover-id', id);

            if (!triggerElement) {
                return;
            }

            const popoverElement = popoverRef.current;

            if (!popoverElement) {
                return;
            }

            const positioningContext = findPositioningContext(popoverElement.parentElement);

            if (!positioningContext) {
                return;
            }

            if (state === 'open') {
                setState('closing');

                setTimeout(() => {
                    setState('closed');
                    handleMove(triggerElement, popoverElement, positioningContext);
                    setState('open');
                }, 200);

                return;
            }

            setState('open');
            handleMove(triggerElement, popoverElement, positioningContext);
        },
        [id, state, popoverRef, handleMove]
    );

    useDocumentEventListener('click', handleClick);

    return (
        <>
            <div
                ref={popoverRef}
                className={styles.wrapper}
                data-position={position}
                data-state={state}
                style={{ top: popoverPosition.top, left: popoverPosition.left }}
            >
                {children}
            </div>
            {state === 'closed' && tooltip}
        </>
    );
};

export default PopoverWrapper;

const findAncestorWithAttribute = (element: HTMLElement | null, attributeName: string, attributeValue: string): HTMLElement | null => {
    let currentElement = element;

    while (currentElement) {
        const attribute = currentElement.getAttribute(attributeName);
        if (attribute === attributeValue) {
            return currentElement;
        }
        currentElement = currentElement.parentElement;
    }

    return null;
};

const findPositioningContext = (element: HTMLElement | null): HTMLElement | null => {
    if (!element) {
        return null;
    }

    const computedStyle = getComputedStyle(element);
    const position = computedStyle.getPropertyValue('position');

    if (position === 'relative' || position === 'absolute' || position === 'fixed' || position === 'sticky') {
        return element;
    }

    return findPositioningContext(element.parentElement);
};
