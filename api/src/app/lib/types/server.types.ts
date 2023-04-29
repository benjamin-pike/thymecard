import express from "express";
import { AuthController } from "../../components/auth/auth.controller";
import { UserController } from "../../components/user/user.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { ContextMiddleware } from "../../middleware/context.middleware";
import { ErrorsMiddleware } from "../../middleware/error.middleware";
import { RecipeController } from "../../components/recipe/recipe.controller";

export interface IDependencies {
    authController: AuthController;
    userController: UserController;
    recipeController: RecipeController
}

export interface IRouters {
    auth: express.Router;
    user: express.Router;
    recipe: express.Router;
}

export interface IMiddleware {
    context: ContextMiddleware;
    auth: AuthMiddleware;
    errors: ErrorsMiddleware;
}