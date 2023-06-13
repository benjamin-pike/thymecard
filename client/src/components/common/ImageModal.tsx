import React, { useEffect, useRef } from 'react';
import styles from './image-modal.module.css';
import { useClickOutside } from '@/hooks/useClickOutside';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { formatClasses } from '@/lib/common.utils';
import { createPortal } from 'react-dom';

interface ImageModalProps {
    urls: string[];
    currentImage: number;
    setCurrentImage: (index: number) => void;
    closeModal: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ urls, currentImage, setCurrentImage, closeModal }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, closeModal);

    const handleNext = () => {
        if (currentImage < urls.length - 1) {
            setCurrentImage(currentImage + 1);
        }
    };

    const handlePrev = () => {
        if (currentImage > 0) {
            setCurrentImage(currentImage - 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }

            if (event.key === 'ArrowRight') {
                handleNext();
            }

            if (event.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal, handleNext, handlePrev]);

    return createPortal(
        <div className={styles.modalOverlay}>
            <div ref={modalRef} className={styles.modalContent}>
                <button className={formatClasses(styles, ['modalButton', 'prev'])} onClick={handlePrev} disabled={currentImage === 0}>
                    <BsChevronCompactLeft />
                </button>
                <img src={urls[currentImage]} className={`${styles.modalImage}`} alt="Slide" />
                <div className={styles.dotContainer}>
                    {urls.map((_, index) => (
                        <div 
                            key={index} 
                            className={`${styles.dot} ${index === currentImage ? styles.active : ''}`}
                            onClick={() => setCurrentImage(index)}
                        />
                    ))}
                </div>
                <button
                    className={formatClasses(styles, ['modalButton', 'next'])}
                    onClick={handleNext}
                    disabled={currentImage === urls.length - 1}
                >
                    <BsChevronCompactRight />
                </button>
            </div>
            <button className={styles.modalCloseButton} onClick={closeModal}>
                <IoMdClose />
            </button>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default ImageModal;
