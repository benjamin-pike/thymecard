import { FC, ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { useClickOutside } from '@mantine/hooks';
import { useWindowKeyDown } from '@/hooks/events/useWindowKeydown';

import { IoMdClose } from 'react-icons/io';

import styles from './modal-wrapper.module.scss';

interface ImageModalProps {
    children: ReactElement;
    closeModal: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ children, closeModal }) => {
    const ref = useClickOutside(closeModal);

    useWindowKeyDown('Escape', closeModal);

    return createPortal(
        <div className={styles.backdrop}>
            <div ref = {ref}>
                {children}
            </div>
            <button className={styles.closeButton} onClick={closeModal}>
                <IoMdClose />
            </button>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default ImageModal;
