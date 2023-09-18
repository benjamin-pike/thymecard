import { FC, useRef, useState, useCallback, useMemo, ReactElement, useEffect } from 'react';
import { useEventListener } from '@/hooks/events/useEventListener';
import { useDocumentEventListener } from '@/hooks/events/useDocumentEventListener';
import { useMount } from '@/hooks/lifecycle/useMount';
import { useMutationObserver } from '@/hooks/dom/useMutationObserver';
import { formatClasses } from '@/lib/common.utils';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import styles from './scroll-wrapper.module.scss';

interface IScrollWrapperProps {
    children: ReactElement;
    className?: string;
    height: string;
    padding: number;
    buttonMargin?: { up?: string; down?: string };
    active?: boolean;
    isScrollable?: boolean;
    useAutoScroll?: boolean;
    useScrollButtons?: boolean;
    useScrollBar?: boolean;
}

const ScrollWrapper: FC<IScrollWrapperProps> = ({
    children,
    className,
    height,
    padding,
    buttonMargin,
    active,
    isScrollable,
    useAutoScroll,
    useScrollButtons,
    useScrollBar,
}) => {
    if (!(active ?? true)) {
        return <>{children}</>;
    }

    const columnRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const upperSegmentRef = useRef<HTMLDivElement>(null);
    const lowerSegmentRef = useRef<HTMLDivElement>(null);

    const [scrollbarIsVisible, setScrollbarIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [initialY, setInitialY] = useState(0);
    const [columnHeight, setColumnHeight] = useState(0);
    const [upperIsHovered, setUpperIsHovered] = useState(false);
    const [lowerIsHovered, setLowerIsHovered] = useState(false);

    const displayScrollButtons = isScrollable !== false && useScrollButtons !== false;
    const displayScrollBar = isScrollable !== false && useScrollBar !== false;

    const handleSegmentHoverState = useCallback(
        (event: MouseEvent) => {
            if (!upperSegmentRef.current || !lowerSegmentRef.current || !columnRef.current) return;

            const upperRect = upperSegmentRef.current.getBoundingClientRect();
            const lowerRect = lowerSegmentRef.current.getBoundingClientRect();

            const scrollIsAtTop = columnRef.current.scrollTop < 10;
            const scrollIsAtBottom = columnRef.current.scrollTop > columnRef.current.scrollHeight - columnRef.current.clientHeight - 10;

            const isInsideUpper =
                event.clientX >= upperRect.left &&
                event.clientX <= upperRect.right &&
                event.clientY >= upperRect.top &&
                event.clientY <= upperRect.bottom;

            const isInsideLower =
                event.clientX >= lowerRect.left &&
                event.clientX <= lowerRect.right &&
                event.clientY >= lowerRect.top &&
                event.clientY <= lowerRect.bottom;

            if (isInsideUpper !== upperIsHovered && (!scrollIsAtTop || isInsideUpper === false)) {
                setUpperIsHovered(isInsideUpper);
            }

            if (isInsideLower !== lowerIsHovered && (!scrollIsAtBottom || isInsideLower === false)) {
                setLowerIsHovered(isInsideLower);
            }
        },
        [upperIsHovered, lowerIsHovered]
    );

    const handleScroll = useCallback(() => {
        if (columnRef.current && scrollbarRef.current) {
            const scrubberHeight = columnRef.current.clientHeight / columnRef.current.scrollHeight;
            const progressHeight = `calc(${scrubberHeight * 100}% - ${padding * 2 * scrubberHeight}rem)`;

            scrollbarRef.current.style.height = progressHeight;

            const scrollTop = columnRef.current.scrollTop;
            const relativeProgress = scrollTop / columnRef.current.scrollHeight;
            const paddingCoefficient = -2 * (relativeProgress - 0.5);
            const progressTop = `calc(${relativeProgress * 100}% + ${paddingCoefficient * padding}rem)`;

            scrollbarRef.current.style.top = progressTop;
        }
    }, [padding]);

    const handleScrollToTop = useCallback(() => {
        const column = columnRef.current;
        if (column) {
            column.style.scrollBehavior = 'smooth';
            column.scrollTop = 0;
            column.style.scrollBehavior = 'unset';
        }
    }, []);

    const handleScrollToBottom = useCallback(() => {
        const column = columnRef.current;
        if (column) {
            column.style.scrollBehavior = 'smooth';
            column.scrollTop = column.scrollHeight;
            column.style.scrollBehavior = 'unset';
        }
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging && columnRef.current && scrollbarRef.current) {
                const deltaY = e.clientY - initialY;
                const { scrollTop, scrollHeight, clientHeight } = columnRef.current;
                const percentScrolled = deltaY / clientHeight;

                columnRef.current.scrollTop = scrollTop + percentScrolled * scrollHeight;

                setInitialY(e.clientY);
            }
        },
        [initialY, isDragging]
    );

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setInitialY(e.clientY);

        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);

        document.body.style.userSelect = 'auto';
        document.body.style.webkitUserSelect = 'auto';
    }, []);

    const checkScrollbarVisibility = useCallback(() => {
        if (columnRef.current) {
            const shouldScroll = columnRef.current.scrollHeight > columnRef.current.clientHeight;

            if (!scrollbarIsVisible && shouldScroll) {
                setScrollbarIsVisible(true);
            }

            if (scrollbarIsVisible && !shouldScroll) {
                setScrollbarIsVisible(false);
            }
        }
    }, [scrollbarIsVisible]);

    useEffect(() => {
        handleScroll();
    }, [scrollbarIsVisible]);

    const handleContainerHeightChange = useCallback(() => {
        checkScrollbarVisibility();

        if (!useAutoScroll) {
            return;
        }

        const column = columnRef.current;
        if (!column) {
            return;
        }

        if (columnHeight < column.scrollHeight) {
            column.style.scrollBehavior = 'smooth';
            column.scrollTo({ top: column.scrollTop + column.clientHeight * 0.25 });
            column.style.scrollBehavior = 'unset';
        }

        setColumnHeight(column.scrollHeight);
    }, [useAutoScroll, checkScrollbarVisibility]);

    const handleMount = useCallback(() => {
        handleScroll();
        checkScrollbarVisibility();
    }, [handleScroll, checkScrollbarVisibility]);

    useMount(handleMount);
    useEventListener('scroll', handleScroll, columnRef);
    useDocumentEventListener('mousemove', handleMouseMove);
    useDocumentEventListener('mouseup', handleMouseUp);
    useDocumentEventListener('mousemove', handleSegmentHoverState);
    useMutationObserver(
        columnRef,
        handleContainerHeightChange,
        useMemo(() => ({ childList: true, subtree: true }), [])
    );

    return (
        <div className={`${styles.wrapper}${className ? ' ' + className : ''}`} style={{ height }}>
            {displayScrollButtons && (
                <div ref={upperSegmentRef} className={formatClasses(styles, ['segment', 'upper'])} data-hovered={upperIsHovered}>
                    <button
                        className={formatClasses(styles, ['scrollButton', 'up'])}
                        style={{ top: buttonMargin?.up }}
                        onClick={handleScrollToTop}
                    >
                        <FaChevronUp />
                    </button>
                </div>
            )}
            <div className={styles.column} style={{ padding: `${padding}rem 0`, overflowY: isScrollable !== false ? 'scroll' : 'hidden' }} ref={columnRef}>
                {children}
            </div>
            {displayScrollBar && scrollbarIsVisible && (
                <div ref={scrollbarRef} className={styles.scrollbar} onMouseDown={handleMouseDown} data-active={isDragging} />
            )}
            {displayScrollButtons && (
                <div ref={lowerSegmentRef} className={formatClasses(styles, ['segment', 'lower'])} data-hovered={lowerIsHovered}>
                    <button
                        className={formatClasses(styles, ['scrollButton', 'down'])}
                        style={{ bottom: buttonMargin?.down }}
                        onClick={handleScrollToBottom}
                    >
                        <FaChevronDown />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScrollWrapper;
