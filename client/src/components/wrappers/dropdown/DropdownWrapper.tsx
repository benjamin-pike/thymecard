import { FC, ReactElement, ReactNode, useCallback, useState } from 'react';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import { useDocumentEventListener } from '@/hooks/common/useDocumentEventListener';
import styles from './dropdown-wrapper.module.scss';

interface IDropdownWrapperProps {
    children: ReactNode;
    id: string;
    position: 'left' | 'right';
    offset?: number;
    tooltip?: ReactElement;
}

const DropdownWrapper: FC<IDropdownWrapperProps> = ({ id, children, position, offset, tooltip }) => {
    const [state, setState] = useState<'open' | 'closing' | 'closed'>('closed');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [prevTriggerElement, setPrevTriggerElement] = useState<HTMLElement | null>(null);

    const handleClickOutside = (e: MouseEvent) => {
        const clickedElement = e.target as HTMLElement;
        const triggerElement = findAncestorWithAttribute(clickedElement, 'data-dropdown-id', id);

        if (triggerElement) {
            return;
        }

        setState('closing');

        setTimeout(() => {
            setState('closed');
        }, 200);
    };

    const dropdownRef = useClickOutside<HTMLDivElement>(handleClickOutside);

    const handleMove = useCallback(
        (trigger: HTMLElement, positioningContext: HTMLElement) => {
            const triggerRect = trigger.getBoundingClientRect();
            const positioningContextRect = positioningContext.getBoundingClientRect();

            const containerScrollTop = positioningContext.scrollTop || document.documentElement.scrollTop;
            const containerScrollLeft = positioningContext.scrollLeft || document.documentElement.scrollLeft;

            let top = 0;
            let left = 0;

            const triggerTop = triggerRect.top + containerScrollTop - positioningContextRect.top;
            const triggerLeft = triggerRect.left + containerScrollLeft - positioningContextRect.left;

            switch (position) {
                case 'left':
                    top = triggerTop + triggerRect.height + (offset || 0);
                    left = triggerLeft + triggerRect.width;
                    break;
                case 'right':
                    top = triggerTop + triggerRect.height + (offset || 0);
                    left = triggerLeft;
                    break;
            }

            setDropdownPosition({ top, left });
        },
        [offset, position]
    );

    const handleClick = useCallback(
        (e: MouseEvent) => {
            const clickedElement = e.target as HTMLElement;
            const triggerElement = findAncestorWithAttribute(clickedElement, 'data-dropdown-id', id);

            if (!triggerElement) {
                return;
            }

            const dropdownElement = dropdownRef.current;

            if (!dropdownElement) {
                return;
            }

            const positioningContext = findPositioningContext(dropdownElement.parentElement);

            if (!positioningContext) {
                return;
            }

            if (state === 'open') {
                setState('closing');

                if (prevTriggerElement) {
                    setPrevTriggerElement(null);
                }

                setTimeout(() => {
                    setState('closed');

                    if (triggerElement === prevTriggerElement) {
                        return;
                    }

                    handleMove(triggerElement, positioningContext);
                    setState('open');
                }, 200);

                return;
            }

            setState('open');
            handleMove(triggerElement, positioningContext);
            setPrevTriggerElement(triggerElement);
        },
        [id, dropdownRef, state, handleMove, prevTriggerElement]
    );

    useDocumentEventListener('click', handleClick);

    return (
        <>
            <div
                ref={dropdownRef}
                className={styles.wrapper}
                data-position={position}
                data-state={state}
                style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
                {children}
            </div>
            {state === 'closed' && tooltip}
        </>
    );
};

export default DropdownWrapper;

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
