import express from "express";
import { IAuthController } from "../../components/auth/auth.controller";
import { IUserController } from "../../components/user/user.controller";
import { IRecipeController } from "../../components/recipe/recipe.controller";
import { IDayController } from "../../components/day/day.controller";
import { IPantryController } from "../../components/pantry/pantry.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { ContextMiddleware } from "../../middleware/context.middleware";
import { ErrorsMiddleware } from "../../middleware/error.middleware";
import { RateLimiterMiddleware } from "../../middleware/rate-limiter.middleware";

export interface IDependencies {
    authController: IAuthController;
    userController: IUserController;
    recipeController: IRecipeController
    dayController: IDayController;
    pantryController: IPantryController;
}

type routers = 'auth' | 'user' | 'recipe' | 'day' | 'pantry';

export type IRouters = {
    [key in routers]: express.Router;
};

export interface IMiddleware {
    context: ContextMiddleware;
    auth: AuthMiddleware;
    errors: ErrorsMiddleware;
    anonRateLimiter: RateLimiterMiddleware;
    authRateLimiter: RateLimiterMiddleware;
}