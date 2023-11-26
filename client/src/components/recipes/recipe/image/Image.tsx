import { useRecipe } from '../RecipeProvider';
import { ICONS } from '@/assets/icons';
import { PiImageDuotone } from 'react-icons/pi';
import styles from './image.module.scss';
import { useCallback, useRef } from 'react';
import { createToast } from '@/lib/toast/toast.utils';
import { isValidUrl } from '@thymecard/types';
import { validateImageUrl } from '@/lib/media.utils';
import { getRecipeImageUrl } from '@/lib/s3/s3.utils';
import { sendRequest } from '@/lib/api/sendRequest';

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
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    const imageUrl = recipe.image ? getRecipeImageUrl(recipe.image) : null;

    return <div className={styles.display}>{imageUrl ? <img src={imageUrl} /> : <PiImageDuotone />}</div>;
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
                const { data, headers } = await sendRequest(`/api/proxy?url=${url}`, 'GET', {
                    responseType: 'arraybuffer',
                    headers: {
                        Accept: 'image/*',
                        'Allow-Cross-Origin-Resource-Sharing': '*'
                    }
                });

                const blob = new Blob([data], { type: headers['content-type'] });
                const blobUrl = URL.createObjectURL(blob);

                if (validateImageUrl(blobUrl)) {
                    image.update(blob);
                } else {
                    createToast('error', 'Invalid image URL');
                    console.log('Invalid image URL');
                }
            } catch (error) {
                createToast('error', 'Failed to fetch image');
                console.log('There was a problem with the fetch operation: ', error);
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
