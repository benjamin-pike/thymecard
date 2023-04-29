import { ErrorCode } from "../../lib/error/errorCode";
import { UnprocessableError } from "../../lib/error/sironaError";
import { IAuthenticatedContext } from "../../middleware/context.middleware";
import { RecipeService } from "./recipe.service";
import { IRecipe, isParseRecipeRequestBody } from "./recipe.types";

interface IRecipeControllerDependencies {
    recipeService: RecipeService;
}

interface IRecipeController {
    parseRecipe(context: IAuthenticatedContext, reqBody: unknown): Promise<IRecipe>;
}

export class RecipeController implements IRecipeController{
    private recipeService: RecipeService;
    
    constructor(deps: IRecipeControllerDependencies) {
        this.recipeService = deps.recipeService;
    }

    public async parseRecipe(_context: IAuthenticatedContext, reqBody: unknown): Promise<IRecipe> {
        if (!isParseRecipeRequestBody(reqBody)) {
            throw new UnprocessableError(ErrorCode.InvalidRecipeParseInput, 'Invalid parse recipe request body', {
                origin: 'RecipeController.parseRecipe',
                data: { reqBody }
            });
        }

        return await this.recipeService.getRecipeFromUrl(reqBody.url);
    }
}