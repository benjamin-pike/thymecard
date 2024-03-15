import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecipe } from '../../../providers/RecipeProvider';
import { PiImageDuotone } from 'react-icons/pi';

import LoadingDots from '@/components/common/loading-dots/LoadingDots';

import { buildRecipeImageUrl } from '@/lib/s3/s3.utils';
import { ICONS } from '@/assets/icons';
import { createToast } from '@/lib/toast/toast.utils';
import { isValidUrl } from '@thymecard/types';
import { imageUrlToBlob } from '@/lib/media.utils';

import styles from './image.module.scss';

const UploadIcon = ICONS.common.upload;

const RecipeImage = () => {
    const { isEditing } = useRecipe();

    return (
        <div className={styles.images} data-editing={isEditing}>
            <div className={styles.container}>{isEditing ? <EditView /> : <DisplayView />} </div>
        </div>
    );
};

const DisplayView = () => {
    const { recipe, isLoading: isRecipeLoading } = useRecipe();

    const [isImageLoading, setIsImageLoading] = useState(true);
    const ref = useRef<HTMLImageElement>(null);

    const imageUrl = recipe?.image ? buildRecipeImageUrl(recipe.image) : null;

    const handleImageLoad = useCallback(() => {
        setIsImageLoading(false);
    }, []);

    useEffect(() => {
        if (!isRecipeLoading && !recipe.image) {
            setIsImageLoading(false);
        }
    }, [isRecipeLoading, recipe]);

    if (isRecipeLoading) {
        return <div className={styles.display}>{isImageLoading && <LoadingDots />}</div>;
    }

    return (
        <div className={styles.display}>
            {isImageLoading && <LoadingDots />}
            {imageUrl ? <img ref={ref} src={imageUrl} data-visible={!isImageLoading} onLoad={handleImageLoad} /> : <PiImageDuotone />}
        </div>
    );
};

const EditView = () => {
    const { image } = useRecipe();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) {
                return;
            }

            const file = e.target.files[0];

            if (!file) {
                return;
            }

            const blob = new Blob([file], { type: file.type });

            image.update(blob);
        },
        [image]
    );

    const handleUrlInputBlur = useCallback(
        async (e: React.FocusEvent<HTMLInputElement>) => {
            const url = e.target.value.trim();

            if (!url || !isValidUrl(url)) {
                return;
            }

            try {
                const blob = await imageUrlToBlob(url);
                image.update(blob);
            } catch (error) {
                createToast('error', 'Failed to fetch image');
            }
        },
        [image]
    );

    const handleClick = () => {
        if (!fileInputRef.current) {
            return;
        }

        fileInputRef.current.click();
    };

    return (
        <div className={styles.add}>
            {image.url ? (
                <div className={styles.current}>
                    <img src={image.url} />
                </div>
            ) : (
                <PiImageDuotone className={styles.placeholder} />
            )}
            <div className={styles.inputs}>
                <button className={styles.upload} onClick={handleClick}>
                    <UploadIcon /> Upload
                </button>
                <p className={styles.orText}>or</p>
                <input className={styles.url} type="text" placeholder="Paste image URL" onBlur={handleUrlInputBlur} />
                <input className={styles.fileInput} type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} />
            </div>
        </div>
    );
};

export default RecipeImage;
