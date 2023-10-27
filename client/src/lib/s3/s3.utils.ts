import { S3_PATHS } from './paths';

export const getUserImageUrl = (userId?: string) => {
    if (!userId) {
        return;
    }

    return `${S3_PATHS.USER_IMAGES}/${userId}.jpg`;
};

export const getRecipeImageUrl = (imageFilename: string) => {
    return `${S3_PATHS.RECIPE_IMAGES}/${imageFilename}`;
};
