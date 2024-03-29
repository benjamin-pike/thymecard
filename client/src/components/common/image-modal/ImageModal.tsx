import { useCallback, FC } from 'react';
import { useWindowKeyDown } from '@/hooks/common/useWindowKeydown';
import ModalWrapper from '@/components/wrappers/modal/ModalWrapper';
import { ModalState } from '@/hooks/common/useModal';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { formatClasses } from '@/lib/common.utils';
import styles from './image-modal.module.scss';

interface ImageModalProps {
    state: ModalState;
    urls: string[];
    currentImage: number;
    changeSelectedImage: (index: number) => void;
    handleCloseModal: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ state, urls, currentImage, changeSelectedImage, handleCloseModal }) => {
    const displayButtons = urls.length > 1;

    const handleNext = useCallback(() => {
        if (currentImage < urls.length - 1) {
            changeSelectedImage(currentImage + 1);
        }
    }, [changeSelectedImage, currentImage, urls.length]);

    const handlePrev = useCallback(() => {
        if (currentImage > 0) {
            changeSelectedImage(currentImage - 1);
        }
    }, [changeSelectedImage, currentImage]);

    useWindowKeyDown('ArrowRight', handleNext);
    useWindowKeyDown('ArrowLeft', handlePrev);

    return (
        <ModalWrapper state={state} handleCloseModal={handleCloseModal} blurBackground={true}>
            <div className={styles.container}>
                {displayButtons && (
                    <button
                        className={formatClasses(styles, ['nagivateButton', 'prev'])}
                        onClick={handlePrev}
                        disabled={currentImage === 0}
                    >
                        <BsChevronCompactLeft />
                    </button>
                )}
                <img src={urls[currentImage]} className={`${styles.image}`} alt="Slide" />
                {displayButtons && (
                    <div className={styles.navigateDots}>
                        {urls.map((_, index) => (
                            <div
                                key={index}
                                className={`${styles.dot} ${index === currentImage ? styles.active : ''}`}
                                onClick={() => changeSelectedImage(index)}
                            />
                        ))}
                    </div>
                )}
                {displayButtons && (
                    <button
                        className={formatClasses(styles, ['nagivateButton', 'next'])}
                        onClick={handleNext}
                        disabled={currentImage === urls.length - 1}
                    >
                        <BsChevronCompactRight />
                    </button>
                )}
            </div>
        </ModalWrapper>
    );
};

export default ImageModal;
