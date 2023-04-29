import axios, { AxiosResponse } from 'axios';
import { NotFoundError, UnprocessableError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { isString } from '../../lib/types/types.utils';
import { RecipeParser, parseJsonLinkedData } from './recipe.utils';
import { IRecipe, IRecipeCreate } from './recipe.types';
import { recipeRepository } from './recipe.model';
import { Types } from 'mongoose';

interface IRecipeService {
    getRecipeFromUrl(url: string): Promise<IRecipeCreate>;
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

    public async updateRecipe(recipeId: string, recipe: IRecipeCreate, userId: string): Promise<IRecipe> {
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
    
    public async getRecipeFromUrl(url: string): Promise<IRecipeCreate> {
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

        return parsedRecipe;
    }
}