import { FC, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '@mantine/hooks';

import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import { ModalState } from '@/hooks/common/useModal';

import styles from './modal-wrapper.module.scss';

export interface IModalWrapperProps {
    children: ReactElement;
    state: ModalState;
    blurBackground: boolean;
    closeOnClickOutside?: boolean;
    handleCloseModal: () => void;
}

const ModalWrapper: FC<IModalWrapperProps> = ({ children, state, blurBackground, closeOnClickOutside, handleCloseModal }) => {
    const ref = useClickOutside(() => {
        if (closeOnClickOutside) {
            handleCloseModal();
        }
    });
    const root = document.getElementById('modal-root');

    useWindowKeyDown('Escape', handleCloseModal);

    if (state === 'closed' || !root) {
        return null;
    }

    return createPortal(
        <div className={styles.backdrop} data-blur={blurBackground} data-state={state}>
            <div ref={ref} className={styles.container}>
                {children}
            </div>
        </div>,
        root
    );
};

export default ModalWrapper;
