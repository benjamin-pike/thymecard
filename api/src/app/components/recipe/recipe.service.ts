import axios, { AxiosResponse } from 'axios';
import { NotFoundError, UnprocessableError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { isString } from '../../lib/types/types.utils';
import { RecipeParser, parseJsonLinkedData } from './recipe.utils';
import { IComment, IRecipe, IRecipeCreate, IRecipeUpdate } from './recipe.types';
import { recipeRepository } from './recipe.model';

export interface IRecipeService {
    createRecipe(recipe: IRecipeCreate, userId: string): Promise<IRecipe>;
    getRecipe(recipeId: string, userId: string): Promise<IRecipe>;
    getRecipes(userId: string): Promise<IRecipe[]>;
    updateRecipe(recipeId: string, recipe: IRecipeUpdate, userId: string): Promise<IRecipe>;
    deleteRecipe(recipeId: string, userId: string): Promise<void>;
    getRecipeFromUrl(url: string): Promise<Partial<IRecipeCreate>>;
    createComment(recipeId: string, userId: string, comment: IComment): Promise<IComment[]>;
    getComments(recipeId: string, userId: string): Promise<IComment[]>;
    deleteComment(recipeId: string, userId: string, commentId: string): Promise<void>;
}

export class RecipeService implements IRecipeService {
    public async createRecipe(recipe: IRecipeCreate, userId: string): Promise<IRecipe> {
        const query = { ...recipe, userId };
        return await recipeRepository.create(query);
    }

    public async getRecipe(recipeId: string, userId: string): Promise<IRecipe> {
        const query = { _id: recipeId, userId: userId };
        const recipe = await recipeRepository.getOne(query);

        if (!recipe) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found', {
                origin: 'RecipeService.getRecipe',
                data: { recipeId, userId }
            });
        }

        return recipe;
    }

    public async getRecipes(userId: string): Promise<IRecipe[]> {
        const query = { userId: userId };
        return await recipeRepository.getAll(query);
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

        return;
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
                data: { url, html }
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
        const updatedRecipe = await recipeRepository.findOneAndUpdate(filter, update);

        if (!updatedRecipe || !updatedRecipe.comments) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.createComment',
                data: { recipeId, userId }
            });
        }

        return updatedRecipe.comments;
    }

    public async getComments(recipeId: string, userId: string): Promise<IComment[]> {
        const filter = {
            _id: recipeId,
            $or: [{ isPublic: true }, { isPublic: false, userId }]
        };
        const recipe = await recipeRepository.getOne(filter);

        if (!recipe) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.getComments',
                data: { recipeId, userId }
            });
        }

        return recipe.comments ?? [];
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

        const updatedRecipe = await recipeRepository.findOneAndUpdate(filter, update);

        if (!updatedRecipe || !updatedRecipe.comments) {
            throw new NotFoundError(ErrorCode.RecipeNotFound, 'The requested recipe could not be found or you do not have access to it', {
                origin: 'RecipeService.deleteComment',
                data: { recipeId, userId }
            });
        }

        return;
    }
}
