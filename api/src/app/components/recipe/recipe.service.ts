import axios, { AxiosResponse } from 'axios';
import { NotFoundError, UnprocessableError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { isString } from '../../lib/types/types.utils';
import { RecipeParser, parseJsonLinkedData } from './recipe.utils';
import { IRecipe } from './recipe.types';

interface IRecipeService {
    getRecipeFromUrl(url: string): Promise<IRecipe>;
}

export class RecipeService implements IRecipeService {
    public async getRecipeFromUrl(url: string): Promise<IRecipe> {
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