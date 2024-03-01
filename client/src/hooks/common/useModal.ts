import { useCallback, useState } from 'react';

const CLOSE_MODAL_ANIMATION_DURATION = 200;

export type ModalState = 'open' | 'closing' | 'closed';

export const useModal = () => {
    const [modalState, setModalState] = useState<ModalState>('closed');

    const openModal = useCallback(() => {
        if (modalState === 'open') {
            return;
        }

        setModalState('open');
    }, [modalState]);

    const closeModal = useCallback(async () => {
        if (modalState !== 'open') {
            return;
        }

        setModalState('closing');

        await new Promise((resolve) => setTimeout(resolve, CLOSE_MODAL_ANIMATION_DURATION));

        setModalState('closed');
    }, [modalState]);

    const toggleModal = useCallback(() => {
        if (modalState === 'closed') {
            openModal();
        } else {
            closeModal();
        }
    }, [closeModal, modalState, openModal]);

    const isModalOpen = modalState === 'open';
    const isModalClosed = modalState === 'closed';

    return { modalState, isModalOpen, isModalClosed, openModal, closeModal, toggleModal };
};
