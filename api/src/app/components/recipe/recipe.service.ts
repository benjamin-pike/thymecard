import axios, { AxiosResponse } from 'axios';
import { NotFoundError, UnprocessableError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { isString } from '../../lib/types/types.utils';
import { RecipeParser, parseJsonLinkedData } from './recipe.utils';
import { IComment, IRecipe, IRecipeCreate, IRecipeSummary, IRecipeUpdate } from './recipe.types';
import { recipeRepository } from './recipe.model';
import { RecipeCache, RecipeSummaryCache } from '../../lib/types/cache.types';

interface IRecipeServiceDependencies {
    recipeCache: RecipeCache;
    recipeSummaryCache: RecipeSummaryCache;
}

export interface IRecipeService {
    createRecipe(recipe: IRecipeCreate, userId: string): Promise<IRecipe>;
    getRecipe(recipeId: string, userId: string): Promise<IRecipe>;
    updateRecipe(recipeId: string, recipe: IRecipeUpdate, userId: string): Promise<IRecipe>;
    deleteRecipe(recipeId: string, userId: string): Promise<void>;
    getSummary(recipeId: string, userId: string): Promise<IRecipeSummary>;
    getSummaries(userId: string): Promise<IRecipeSummary[]>;
    getRecipeFromUrl(url: string): Promise<Partial<IRecipeCreate>>;
    createComment(recipeId: string, userId: string, comment: IComment): Promise<IComment[]>;
    getComments(recipeId: string, userId: string): Promise<IComment[]>;
    deleteComment(recipeId: string, userId: string, commentId: string): Promise<void>;
}

export class RecipeService implements IRecipeService {
    private readonly recipeCache: RecipeCache;
    private readonly summaryCache: RecipeSummaryCache;

    constructor(deps: IRecipeServiceDependencies) {
        this.recipeCache = deps.recipeCache;
        this.summaryCache = deps.recipeSummaryCache;
    }

    public async createRecipe(recipe: IRecipeCreate, userId: string): Promise<IRecipe> {
        const query = { ...recipe, userId };
        const newRecipe = await recipeRepository.create(query);

        this.recipeCache.set(newRecipe._id, newRecipe);
        this.summaryCache.delete(userId);

        return newRecipe;
    }

    public async getRecipe(recipeId: string, userId: string): Promise<IRecipe> {
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

    public async updateRecipe(recipeId: string, recipe: IRecipeUpdate, userId: string): Promise<IRecipe> {
        const query = { _id: recipeId, userId: userId };
        const updatedRecipe = await recipeRepository.findOneAndUpdate(query, recipe);

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

    public async deleteRecipe(recipeId: string, userId: string): Promise<void> {
        const query = { _id: recipeId, userId: userId };
        const deletedRecipe = await recipeRepository.delete(query);

        if (!deletedRecipe) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found', {
                origin: 'RecipeService.deleteRecipe',
                data: { recipeId, userId }
            });
        }

        this.recipeCache.delete(recipeId);

        return;
    }
    public async getSummary(recipeId: string, userId: string): Promise<IRecipeSummary> {
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

    public async getRecipeFromUrl(url: string): Promise<Partial<IRecipeCreate>> {
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
        const parsedRecipe = recipeParser.parseRecipe();

        return { ...parsedRecipe, source: url };
    }

    public async createComment(recipeId: string, userId: string, comment: IComment): Promise<IComment[]> {
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

    public async getComments(recipeId: string, userId: string): Promise<IComment[]> {
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
    name: 1,
    primaryImage: {
        $cond: [
            {
                $gt: [
                    {
                        $size: {
                            $ifNull: ['$images', []]
                        }
                    },
                    0
                ]
            },
            {
                $arrayElemAt: ['$images', 0]
            },
            null
        ]
    },
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
