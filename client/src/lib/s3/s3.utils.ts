import { S3_PATHS } from './paths';

export const getUserImageUrl = (imageFilename?: string) => {
    if (!imageFilename) {
        return `${S3_PATHS.USER_IMAGES}/default.jpg`;
    }

    return `${S3_PATHS.USER_IMAGES}/${imageFilename}`;
};

export const getRecipeImageUrl = (imageFilename: string) => {
    return `${S3_PATHS.RECIPE_IMAGES}/${imageFilename}`;
};
