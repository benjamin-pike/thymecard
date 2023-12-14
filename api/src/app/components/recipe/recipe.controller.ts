import { ZodError } from 'zod';
import { UnprocessableError } from '../../lib/error/thymecardError';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IRecipeService } from './recipe.service';
import { createRecipeSchema, updateRecipeSchema } from './recipe.types';
import { formatZodError } from '../../lib/error/error.utils';
import { isPlainObject, isValidMongoId } from '../../lib/types/typeguards.utils';
import {
    ErrorCode,
    IRecipe,
    IRecipeComment,
    IRecipeCreate,
    IRecipeParseResponse,
    IRecipeSummary,
    IRecipeUpdate,
    isDefined,
    isParseRecipeRequestBody,
    isRecipeCommentCreateResource,
    isString
} from '@thymecard/types';

interface IRecipeControllerDependencies {
    recipeService: IRecipeService;
}

export interface IRecipeController {
    createRecipe(context: IAuthenticatedContext, resource: unknown, image?: Express.Multer.File): Promise<IRecipe>;
    getRecipe(context: IAuthenticatedContext, recipeId: string): Promise<IRecipe>;
    updateRecipe(context: IAuthenticatedContext, recipeId: string, resource: unknown, image?: Express.Multer.File): Promise<IRecipe>;
    deleteRecipe(context: IAuthenticatedContext, recipeId: string): Promise<void>;
    getSummary(context: IAuthenticatedContext, recipeId: string): Promise<IRecipeSummary>;
    getSummaries(context: IAuthenticatedContext): Promise<IRecipeSummary[]>;
    parseRecipe(context: IAuthenticatedContext, reqBody: unknown): Promise<IRecipeParseResponse>;
    createComment(context: IAuthenticatedContext, recipeId: string, resource: unknown): Promise<IRecipeComment[]>;
    getComments(context: IAuthenticatedContext, recipeId: string): Promise<IRecipeComment[]>;
    deleteComment(context: IAuthenticatedContext, recipeId: string, commentId: string): Promise<void>;
}

export class RecipeController implements IRecipeController {
    private recipeService: IRecipeService;

    constructor(deps: IRecipeControllerDependencies) {
        this.recipeService = deps.recipeService;
    }

    public async createRecipe(context: IAuthenticatedContext, resource: unknown, image: Express.Multer.File): Promise<IRecipe> {
        try {
            if (!isString(resource) || !isDefined(image)) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeCreateResource, 'Invalid recipe create resource', {
                    origin: 'RecipeController.create',
                    data: { resource, image: isDefined(image) }
                });
            }

            const parsedResource = JSON.parse(resource);

            if (!isPlainObject(parsedResource)) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeCreateResource, 'Invalid recipe create resource', {
                    origin: 'RecipeController.create',
                    data: { resource }
                });
            }

            const recipeResource: IRecipeCreate = { ...createRecipeSchema.parse({ ...parsedResource, userId: context.userId }) };

            return await this.recipeService.createRecipe(context.userId, recipeResource, image);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeCreateResource, formatZodError(err), {
                    origin: 'RecipeController.create',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async getRecipe(context: IAuthenticatedContext, recipeId: string): Promise<IRecipe> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }
        return await this.recipeService.getRecipe(context.userId, recipeId);
    }

    public async updateRecipe(
        context: IAuthenticatedContext,
        recipeId: string,
        resource: unknown,
        image?: Express.Multer.File
    ): Promise<IRecipe> {
        try {
            if (!isValidMongoId(recipeId)) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                    origin: 'RecipeController.getRecipe',
                    data: { recipeId }
                });
            }

            if (!isString(resource)) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeUpdateResource, 'Invalid recipe update resource', {
                    origin: 'RecipeController.update',
                    data: { resource }
                });
            }

            const recipeResource: IRecipeUpdate = updateRecipeSchema.parse(JSON.parse(resource));

            return await this.recipeService.updateRecipe(context.userId, recipeId, recipeResource, image);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeUpdateResource, formatZodError(err), {
                    origin: 'RecipeController.update',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async deleteRecipe(context: IAuthenticatedContext, recipeId: string): Promise<void> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }

        await this.recipeService.deleteRecipe(context.userId, recipeId);
    }

    public async getSummary(context: IAuthenticatedContext, recipeId: string): Promise<IRecipeSummary> {
        return await this.recipeService.getSummary(context.userId, recipeId);
    }

    public async getSummaries(context: IAuthenticatedContext): Promise<IRecipeSummary[]> {
        return await this.recipeService.getSummaries(context.userId);
    }

    public async parseRecipe(_context: IAuthenticatedContext, reqBody: unknown): Promise<IRecipeParseResponse> {
        if (!isParseRecipeRequestBody(reqBody)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeParseRequestBody, 'Invalid recipe parse request body', {
                origin: 'RecipeController.parseRecipe',
                data: { reqBody }
            });
        }

        return await this.recipeService.getRecipeFromUrl(reqBody.url);
    }

    public async createComment(context: IAuthenticatedContext, recipeId: string, resource: unknown): Promise<IRecipeComment[]> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }

        if (!isRecipeCommentCreateResource(resource)) {
            throw new UnprocessableError(ErrorCode.InvalidCommentCreateResource, 'Invalid comment', {
                origin: 'RecipeController.createComment',
                data: { resource }
            });
        }

        const commentResource: IRecipeComment = {
            ...resource,
            userId: context.userId,
            createdAt: new Date()
        };

        return await this.recipeService.createComment(context.userId, recipeId, commentResource);
    }

    public async getComments(context: IAuthenticatedContext, recipeId: string): Promise<IRecipeComment[]> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }

        return await this.recipeService.getComments(context.userId, recipeId);
    }

    public async deleteComment(context: IAuthenticatedContext, recipeId: string, commentId: string): Promise<void> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }

        return await this.recipeService.deleteComment(context.userId, recipeId, commentId);
    }
}
