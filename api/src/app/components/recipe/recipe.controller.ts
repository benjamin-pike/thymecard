import { ZodError } from 'zod';
import { ErrorCode } from '../../lib/error/errorCode';
import { UnprocessableError } from '../../lib/error/sironaError';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IRecipeService } from './recipe.service';
import {
    IComment,
    IRecipe,
    IRecipeCreate,
    IRecipeSummary,
    IRecipeUpdate,
    createRecipeSchema,
    isCommentCreateResource,
    isParseRecipeRequestBody,
    updateRecipeSchema
} from './recipe.types';
import { formatZodError } from '../../lib/error/error.utils';
import { isPlainObject, isValidMongoId } from '../../lib/types/typeguards.utils';

interface IRecipeControllerDependencies {
    recipeService: IRecipeService;
}

export interface IRecipeController {
    createRecipe(context: IAuthenticatedContext, resource: unknown): Promise<IRecipe>;
    getRecipe(context: IAuthenticatedContext, recipeId: string): Promise<IRecipe>;
    updateRecipe(context: IAuthenticatedContext, recipeId: string, resource: unknown): Promise<IRecipe>;
    deleteRecipe(context: IAuthenticatedContext, recipeId: string): Promise<void>;
    getSummary(context: IAuthenticatedContext, recipeId: string): Promise<IRecipeSummary>;
    getSummaries(context: IAuthenticatedContext): Promise<IRecipeSummary[]>;
    parseRecipe(context: IAuthenticatedContext, reqBody: unknown): Promise<Partial<IRecipeCreate>>;
    createComment(context: IAuthenticatedContext, recipeId: string, resource: unknown): Promise<IComment[]>;
    getComments(context: IAuthenticatedContext, recipeId: string): Promise<IComment[]>;
    deleteComment(context: IAuthenticatedContext, recipeId: string, commentId: string): Promise<void>;
}

export class RecipeController implements IRecipeController {
    private recipeService: IRecipeService;

    constructor(deps: IRecipeControllerDependencies) {
        this.recipeService = deps.recipeService;
    }

    public async createRecipe(context: IAuthenticatedContext, resource: unknown): Promise<IRecipe> {
        try {
            if (!isPlainObject(resource)) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeCreateResource, 'Invalid recipe create resource', {
                    origin: 'RecipeController.create',
                    data: { resource }
                });
            }

            const recipeResource: IRecipeCreate = { ...createRecipeSchema.parse({ ...resource, userId: context.userId }) };

            return await this.recipeService.createRecipe(recipeResource, context.userId);
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
        return await this.recipeService.getRecipe(recipeId, context.userId);
    }

    public async updateRecipe(context: IAuthenticatedContext, recipeId: string, resource: unknown): Promise<IRecipe> {
        try {
            if (!isValidMongoId(recipeId)) {
                throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                    origin: 'RecipeController.getRecipe',
                    data: { recipeId }
                });
            }

            const recipeResource: IRecipeUpdate = updateRecipeSchema.parse(resource);

            return await this.recipeService.updateRecipe(recipeId, recipeResource, context.userId);
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
        
        await this.recipeService.deleteRecipe(recipeId, context.userId);
    }

    public async getSummary(context: IAuthenticatedContext, recipeId: string): Promise<IRecipeSummary> {
        return await this.recipeService.getSummary(recipeId, context.userId);
    }

    public async getSummaries(context: IAuthenticatedContext): Promise<IRecipeSummary[]> {
        return await this.recipeService.getSummaries(context.userId);
    }

    public async parseRecipe(_context: IAuthenticatedContext, reqBody: unknown): Promise<Partial<IRecipeCreate>> {
        if (!isParseRecipeRequestBody(reqBody)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeParseRequestBody, 'Invalid recipe parse request body', {
                origin: 'RecipeController.parseRecipe',
                data: { reqBody }
            });
        }

        return await this.recipeService.getRecipeFromUrl(reqBody.url);
    }

    public async createComment(context: IAuthenticatedContext, recipeId: string, resource: unknown): Promise<IComment[]> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }
        
        if (!isCommentCreateResource(resource)) {
            throw new UnprocessableError(ErrorCode.InvalidCommentCreateResource, 'Invalid comment', {
                origin: 'RecipeController.createComment',
                data: { resource }
            });
        }

        const commentResource: IComment = {
            ...resource,
            userId: context.userId,
            createdAt: new Date()
        };

        return await this.recipeService.createComment(recipeId, context.userId, commentResource);
    }

    public async getComments(context: IAuthenticatedContext, recipeId: string): Promise<IComment[]> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }
        
        return await this.recipeService.getComments(recipeId, context.userId);
    }

    public async deleteComment(context: IAuthenticatedContext, recipeId: string, commentId: string): Promise<void> {
        if (!isValidMongoId(recipeId)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeId, 'Invalid recipe ID', {
                origin: 'RecipeController.getRecipe',
                data: { recipeId }
            });
        }
        
        return await this.recipeService.deleteComment(recipeId, context.userId, commentId);
    }
}
