// ImageGrid.tsx
import React, { useState } from 'react';
import styles from './image-grid.module.css';
import ImageModal from './ImageModal';

interface ImageGridProps {
    urls: string[];
    height: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ urls, height }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const length = urls.length;
    const extra = length - 4;

    const openModal = (index: number) => {
        setCurrentImage(index);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className={styles.container} style={{ height: `${height}rem` }}>
                {length === 1 ? (
                    <div className={`${styles.imageContainer} ${styles.full}`} onClick={() => openModal(0)}>
                        <img src={urls[0]} className={styles.image} alt="Image 1" />
                    </div>
                ) : length === 3 ? (
                    <>
                        <div className={`${styles.imageContainer} ${styles.half}`} onClick={() => openModal(0)}>
                            <img src={urls[0]} className={styles.image} alt="Image 1" />
                        </div>
                        <div className={styles.splitContainer}>
                            <div className={`${styles.imageContainer} ${styles.quarter}`} onClick={() => openModal(1)}>
                                <img src={urls[1]} className={styles.image} alt="Image 2" />
                            </div>
                            <div className={`${styles.imageContainer} ${styles.quarter}`} onClick={() => openModal(2)}>
                                <img src={urls[2]} className={styles.image} alt="Image 3" />
                            </div>
                        </div>
                    </>
                ) : (
                    urls.slice(0, Math.min(length, 4)).map((url, index) => (
                        <div key={index} className={`${styles.imageContainer} ${styles.half}`} onClick={() => openModal(index)}>
                            <img src={url} className={styles.image} alt={`Image ${index + 1}`} />
                            {extra > 0 && index === 3 && <div className={styles.overlay}>{`+${extra}`}</div>}
                        </div>
                    ))
                )}
            </div>
            {isModalOpen && (
                <ImageModal
                    urls={urls}
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                    closeModal={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default ImageGrid;
