import { FC, ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { useClickOutside } from '@mantine/hooks';
import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';

import { IoMdClose } from 'react-icons/io';

import styles from './modal-wrapper.module.scss';

interface IModalWrapperProps {
    children: ReactElement;
    isOpen: boolean;
    blurBackground: boolean;
    closeModal: () => void;
}

const ModalWrapper: FC<IModalWrapperProps> = ({ children, isOpen, blurBackground, closeModal }) => {
    const ref = useClickOutside(closeModal);
    const root = document.getElementById('modal-root');

    useWindowKeyDown('Escape', closeModal);

    if (!isOpen || !root) {
        return null;
    }

    return createPortal(
        <div className={styles.backdrop} data-blur={blurBackground}>
            <div ref={ref}>{children}</div>
            <button className={styles.closeButton} onClick={closeModal}>
                <IoMdClose />
            </button>
        </div>,
        root
    );
};

export default ModalWrapper;
