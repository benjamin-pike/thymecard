import { FC, useCallback, useState } from 'react';
import ImageModal from '../image-modal/ImageModal';
import styles from './image-grid.module.scss';
import { isDefined } from '@/lib/type.utils';

interface ImageGridProps {
    urls: string[];
    height?: number;
    imageBorderRadius?: number;
    imageSpacing?: number;
}

const ImageGrid: FC<ImageGridProps> = ({ urls, height, imageBorderRadius, imageSpacing }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const length = urls.length;
    const extra = length - 4;

    const openModal = useCallback((index: number) => {
        setCurrentImage(index);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const changeSelectedImage = useCallback((index: number) => {
        setCurrentImage(index);
    }, []);

    const containerStyle = {
        gap: isDefined(imageSpacing) ? `${imageSpacing}rem` : undefined,
        height: height ? `${height}rem` : '100%'
    };
    const imageStyle = isDefined(imageBorderRadius) ? { borderRadius: `${imageBorderRadius}rem` } : {};
    const halfStyle = isDefined(imageSpacing) ? { gap: `${imageSpacing}rem`, width: `calc(50% - ${imageSpacing / 2}rem)` } : {};
    const quarterStyle = isDefined(imageSpacing) ? { height: `calc(50% - ${imageSpacing / 2}rem)` } : {};

    return (
        <>
            <div className={styles.container} style={containerStyle}>
                {length === 1 ? (
                    <div className={`${styles.imageContainer} ${styles.full}`} onClick={() => openModal(0)}>
                        <img src={urls[0]} className={styles.image} style={imageStyle} alt="Image 1" />
                    </div>
                ) : length === 3 ? (
                    <>
                        <div className={`${styles.imageContainer} ${styles.half}`} style={halfStyle} onClick={() => openModal(0)}>
                            <img src={urls[0]} className={styles.image} style={imageStyle} alt="Image 1" />
                        </div>
                        <div className={styles.splitContainer} style={halfStyle}>
                            <div className={`${styles.imageContainer} ${styles.quarter}`} style={quarterStyle} onClick={() => openModal(1)}>
                                <img src={urls[1]} className={styles.image} style={imageStyle} alt="Image 2" />
                            </div>
                            <div className={`${styles.imageContainer} ${styles.quarter}`} style={quarterStyle} onClick={() => openModal(2)}>
                                <img src={urls[2]} className={styles.image} style={imageStyle} alt="Image 3" />
                            </div>
                        </div>
                    </>
                ) : (
                    urls.slice(0, Math.min(length, 4)).map((url, index) => (
                        <div
                            key={index}
                            className={`${styles.imageContainer} ${styles.half}`}
                            style={halfStyle}
                            onClick={() => openModal(index)}
                        >
                            <img src={url} className={styles.image} style={imageStyle} alt={`Image ${index + 1}`} />
                            {extra > 0 && index === 3 && <div className={styles.overlay} style={imageStyle}>{`+${extra}`}</div>}
                        </div>
                    ))
                )}
            </div>
            <ImageModal
                isOpen={isModalOpen}
                urls={urls}
                currentImage={currentImage}
                changeSelectedImage={changeSelectedImage}
                closeModal={closeModal}
            />
        </>
    );
};

export default ImageGrid;
