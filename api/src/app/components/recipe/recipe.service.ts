import axios, { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import fileType from 'file-type';
import sharp from 'sharp';
import { S3Repository } from '../../lib/data/s3.repository';
import { NotFoundError, UnprocessableError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { isString } from '../../lib/types/typeguards.utils';
import { RecipeParser, parseJsonLinkedData } from './recipe.utils';
import { recipeRepository } from './recipe.model';
import { RecipeCache, RecipeSummaryCache } from '../../lib/types/cache.types';
import { IRecipe, IRecipeComment, IRecipeCreate, IRecipeParseResponse, IRecipeSummary, IRecipeUpdate } from '@sirona/types';

interface IRecipeServiceDependencies {
    recipeCache: RecipeCache;
    recipeSummaryCache: RecipeSummaryCache;
    s3Repository: S3Repository;
}

export interface IRecipeService {
    createRecipe(userId: string, recipe: IRecipeCreate, image: Express.Multer.File): Promise<IRecipe>;
    getRecipe(userId: string, recipeId: string): Promise<IRecipe>;
    updateRecipe(userId: string, recipeId: string, recipe: IRecipeUpdate, image?: Express.Multer.File): Promise<IRecipe>;
    deleteRecipe(userId: string, recipeId: string): Promise<void>;
    getSummary(userId: string, recipeId: string): Promise<IRecipeSummary>;
    getSummaries(userId: string): Promise<IRecipeSummary[]>;
    getRecipeFromUrl(url: string): Promise<IRecipeParseResponse>;
    createComment(userId: string, recipeId: string, comment: IRecipeComment): Promise<IRecipeComment[]>;
    getComments(userId: string, recipeId: string): Promise<IRecipeComment[]>;
    deleteComment(userId: string, recipeId: string, commentId: string): Promise<void>;
}

export class RecipeService implements IRecipeService {
    private readonly recipeCache: RecipeCache;
    private readonly summaryCache: RecipeSummaryCache;
    private readonly s3Repository: S3Repository;

    constructor(deps: IRecipeServiceDependencies) {
        this.recipeCache = deps.recipeCache;
        this.summaryCache = deps.recipeSummaryCache;
        this.s3Repository = deps.s3Repository;
    }

    public async createRecipe(userId: string, recipe: IRecipeCreate, image: Express.Multer.File): Promise<IRecipe> {
        const imageFilename = uuid();
        const query = { ...recipe, userId, image: `${imageFilename}.jpg` };

        const extension = await fileType.fromBuffer(image.buffer);
        if (!extension) {
            throw new UnprocessableError(ErrorCode.InvalidImageResource, 'The provided image is invalid', {
                origin: 'RecipeService.updateRecipe',
                data: { userId }
            });
        }

        let imageBuffer = image.buffer;
        if (extension.ext !== 'jpg') {
            imageBuffer = await sharp(image.buffer).jpeg().toBuffer();
        }

        await this.s3Repository.uploadFile(image.buffer, imageFilename, 'jpg', 'images/recipes');

        const newRecipe = await recipeRepository.create(query);

        this.recipeCache.set(newRecipe._id, newRecipe);
        this.summaryCache.delete(userId);

        return newRecipe;
    }

    public async getRecipe(userId: string, recipeId: string): Promise<IRecipe> {
        const cachedRecipe = this.recipeCache.get(recipeId);
        if (cachedRecipe) {
            return cachedRecipe;
        }

        const query = {
            _id: recipeId,
            $or: [{ isPublic: true }, { isPublic: false, userId }]
        };
        const recipe = await recipeRepository.getOne(query);

        if (!recipe) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.getRecipe',
                data: { recipeId, userId }
            });
        }

        this.recipeCache.set(recipeId, recipe);

        return recipe;
    }

    public async updateRecipe(userId: string, recipeId: string, update: IRecipeUpdate, image?: Express.Multer.File): Promise<IRecipe> {
        const query = { _id: recipeId, userId: userId };

        let updateWithImage = update;
        if (image) {
            let currentRecipe: IRecipe | null = this.recipeCache.get(recipeId);
            if (!currentRecipe) {
                currentRecipe = await recipeRepository.getOne(query);
            }

            if (!currentRecipe) {
                throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found', {
                    origin: 'RecipeService.updateRecipe',
                    data: { recipeId, userId }
                });
            }

            const extension = await fileType.fromBuffer(image.buffer);
            if (!extension) {
                throw new UnprocessableError(ErrorCode.InvalidImageResource, 'The provided image is invalid', {
                    origin: 'RecipeService.updateRecipe',
                    data: { recipeId, userId }
                });
            }

            let imageBuffer = image.buffer;
            if (extension.ext !== 'jpg') {
                imageBuffer = await sharp(image.buffer).jpeg().toBuffer();
            }

            const newImageFilename = uuid();

            await this.s3Repository.uploadFile(imageBuffer, newImageFilename, 'jpg', 'images/recipes');
            if (currentRecipe.image) {
                await this.s3Repository.deleteFile(`${currentRecipe.image}.jpg`, 'images/recipes');
            }

            updateWithImage = { ...update, image: `${newImageFilename}.jpg` };
        }

        const updatedRecipe = await recipeRepository.findOneAndUpdate(query, updateWithImage);

        if (!updatedRecipe) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found', {
                origin: 'RecipeService.updateRecipe',
                data: { recipeId, userId }
            });
        }

        this.recipeCache.set(recipeId, updatedRecipe);
        this.summaryCache.delete(userId);

        return updatedRecipe;
    }

    public async deleteRecipe(userId: string, recipeId: string): Promise<void> {
        const query = { _id: recipeId, userId: userId };
        const deletedRecipe = await recipeRepository.delete(query);

        if (!deletedRecipe) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found', {
                origin: 'RecipeService.deleteRecipe',
                data: { recipeId, userId }
            });
        }

        this.recipeCache.delete(recipeId);
        this.summaryCache.delete(userId);

        return;
    }

    public async getSummary(userId: string, recipeId: string): Promise<IRecipeSummary> {
        const cachedSummaries = this.summaryCache.get(userId);
        const cachedSummary = cachedSummaries?.find((summary) => summary._id === recipeId);
        if (cachedSummary) {
            return cachedSummary;
        }

        const query = {
            _id: recipeId,
            $or: [{ isPublic: true }, { isPublic: false, userId }]
        };
        const projection = summaryProjection;
        const summary = await recipeRepository.getOne<IRecipeSummary>(query, projection);

        if (!summary) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found', {
                origin: 'RecipeService.getSummary',
                data: { recipeId, userId }
            });
        }

        this.summaryCache.set(userId, cachedSummaries ? [...cachedSummaries, summary] : [summary]);

        return summary;
    }

    public async getSummaries(userId: string): Promise<IRecipeSummary[]> {
        const cachedSummaries = this.summaryCache.get(userId);
        if (cachedSummaries) {
            return cachedSummaries;
        }

        const query = { userId: userId };
        const projection = summaryProjection;

        const summaries = await recipeRepository.getAll<IRecipeSummary>(query, projection);

        this.summaryCache.set(userId, summaries);

        return summaries;
    }

    public async getRecipeFromUrl(url: string): Promise<IRecipeParseResponse> {
        let axiosRes: AxiosResponse;
        try {
            axiosRes = await axios(url);
        } catch (err) {
            throw new NotFoundError(ErrorCode.ExternalPageNotFound, 'The requested extenral page could not be found', {
                origin: 'RecipeService.getRecipeFromUrl',
                data: { url }
            });
        }

        const html = axiosRes.data;

        if (!isString(html)) {
            throw new UnprocessableError(ErrorCode.InvalidRequestReturnType, 'The requested external page returned invalid data', {
                origin: 'RecipeService.getRecipeFromUrl',
                data: { url }
            });
        }

        const linkedData = parseJsonLinkedData(html);
        const recipeData = linkedData?.Recipe;

        if (!recipeData) {
            throw new UnprocessableError(ErrorCode.InvalidRequestReturnType, 'We could not find a recipe on the page you requested', {
                origin: 'RecipeService.getRecipeFromUrl',
                data: { html, linkedData }
            });
        }

        const recipeParser = new RecipeParser(recipeData);
        const { recipe, image } = recipeParser.parseRecipe();

        return { recipe: { ...recipe, source: url }, image };
    }

    public async createComment(recipeId: string, userId: string, comment: IRecipeComment): Promise<IRecipeComment[]> {
        const filter = {
            _id: recipeId,
            $or: [{ isPublic: true }, { isPublic: false, userId }]
        };
        const update = { $push: { comments: comment } };
        const projection = { comments: 1 };
        const { comments } = (await recipeRepository.findOneAndUpdate<Pick<IRecipe, '_id' | 'comments'>>(filter, update, projection)) ?? {};

        if (!comments) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.createComment',
                data: { recipeId, userId }
            });
        }

        const cachedRecipe = this.recipeCache.get(recipeId);
        if (cachedRecipe) {
            const updatedRecipe = { ...cachedRecipe, comments };
            this.recipeCache.set(recipeId, updatedRecipe);
        }
        this.summaryCache.delete(userId);

        return comments;
    }

    public async getComments(recipeId: string, userId: string): Promise<IRecipeComment[]> {
        const cachedRecipe = this.recipeCache.get(recipeId);
        if (cachedRecipe) {
            return cachedRecipe.comments ?? [];
        }

        const filter = {
            _id: recipeId,
            $or: [{ isPublic: true }, { isPublic: false, userId }]
        };
        const projection = { comments: 1 };
        const { _id, comments } = (await recipeRepository.getOne<Pick<IRecipe, '_id' | 'comments'>>(filter, projection)) ?? {};

        if (!_id) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.getComments',
                data: { recipeId, userId }
            });
        }

        return comments ?? [];
    }

    public async deleteComment(recipeId: string, userId: string, commentId: string): Promise<void> {
        const filter = {
            _id: recipeId,
            $or: [{ isPublic: true }, { isPublic: false, userId }]
        };
        const update = {
            $pull: {
                comments: {
                    _id: commentId,
                    userId: userId
                }
            }
        };
        const projection = { comments: 1 };

        const { _id, comments } =
            (await recipeRepository.findOneAndUpdate<Pick<IRecipe, '_id' | 'comments'>>(filter, update, projection)) ?? {};

        if (!_id) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.deleteComment',
                data: { recipeId, userId }
            });
        }

        const cachedRecipe = this.recipeCache.get(recipeId);
        if (cachedRecipe) {
            const updatedRecipe = { ...cachedRecipe, comments };
            this.recipeCache.set(recipeId, updatedRecipe);
        }
        this.summaryCache.delete(userId);

        return;
    }
}

const summaryProjection: Record<keyof IRecipeSummary, any> = {
    _id: 1,
    title: 1,
    image: 1,
    category: 1,
    cuisine: 1,
    keywords: 1,
    prepTime: 1,
    cookTime: 1,
    totalTime: 1,
    yield: 1,
    diet: 1,
    calories: '$nutrition.calories',
    ingredientsCount: { $size: { $ifNull: ['$ingredients', []] } },
    commentsCount: { $size: { $ifNull: ['$comments', []] } },
    rating: 1,
    isBookmarked: 1,
    isPublic: 1,
    createdAt: 1,
    updatedAt: 1
};
