import { FC, ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { useClickOutside } from '@mantine/hooks';
import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { QuickSearchState } from '@/hooks/common/useQuickSearch';

import styles from './quick-search-wrapper.module.scss';

interface IQuickSearchWrapperProps {
    children: ReactElement;
    state: QuickSearchState;
    blurBackground: boolean;
    handleCloseModal: () => void;
}

const QuickSearchWrapper: FC<IQuickSearchWrapperProps> = ({ children, state, blurBackground, handleCloseModal }) => {
    const ref = useClickOutside(handleCloseModal);
    const root = document.getElementById('search-root');

    useWindowKeyDown('Escape', handleCloseModal);

    if (state === 'closed' || !root) {
        return null;
    }

    return createPortal(
        <div className={styles.backdrop} data-blur={blurBackground} data-state={state}>
            <div className={styles.container} ref={ref}>
                {children}
            </div>
        </div>,
        root
    );
};

export default QuickSearchWrapper;
