import express from "express";
import { IAuthController } from "../../components/auth/auth.controller";
import { IUserController } from "../../components/user/user.controller";
import { IRecipeController } from "../../components/recipe/recipe.controller";
import { IPlannerController } from "../../components/planner/planner.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { ContextMiddleware } from "../../middleware/context.middleware";
import { ErrorsMiddleware } from "../../middleware/error.middleware";

export interface IDependencies {
    authController: IAuthController;
    userController: IUserController;
    recipeController: IRecipeController
    plannerController: IPlannerController;
}

type routers = 'auth' | 'user' | 'recipe' | 'planner'

export type IRouters = {
    [key in routers]: express.Router;
};

export interface IMiddleware {
    context: ContextMiddleware;
    auth: AuthMiddleware;
    errors: ErrorsMiddleware;
}