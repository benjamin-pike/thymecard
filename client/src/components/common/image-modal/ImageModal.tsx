import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useWindowKeyDown } from '@/hooks/events/useWindowKeydown';

import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';

import ModalWrapper from '@/components/wrappers/modal/ModalWrapper';

import { formatClasses } from '@/lib/common.utils';

import styles from './image-modal.module.scss';

interface ImageModalProps {
    urls: string[];
    currentImage: number;
    changeSelectedImage: (index: number) => void;
    closeModal: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ urls, currentImage, changeSelectedImage, closeModal }) => {
    const handleNext = useCallback(() => {
        if (currentImage < urls.length - 1) {
            changeSelectedImage(currentImage + 1);
        }
    }, [currentImage]);

    const handlePrev = useCallback(() => {
        if (currentImage > 0) {
            changeSelectedImage(currentImage - 1);
        }
    }, [currentImage]);

    useWindowKeyDown('ArrowRight', handleNext);
    useWindowKeyDown('ArrowLeft', handlePrev);

    return createPortal(
        <ModalWrapper closeModal={closeModal}>
            <div className={styles.container}>
                <button className={formatClasses(styles, ['nagivateButton', 'prev'])} onClick={handlePrev} disabled={currentImage === 0}>
                    <BsChevronCompactLeft />
                </button>
                <img src={urls[currentImage]} className={`${styles.image}`} alt="Slide" />
                <div className={styles.navigateDots}>
                    {urls.map((_, index) => (
                        <div
                            key={index}
                            className={`${styles.dot} ${index === currentImage ? styles.active : ''}`}
                            onClick={() => changeSelectedImage(index)}
                        />
                    ))}
                </div>
                <button
                    className={formatClasses(styles, ['nagivateButton', 'next'])}
                    onClick={handleNext}
                    disabled={currentImage === urls.length - 1}
                >
                    <BsChevronCompactRight />
                </button>
            </div>
        </ModalWrapper>,
        document.getElementById('modal-root')!
    );
};

export default ImageModal;
