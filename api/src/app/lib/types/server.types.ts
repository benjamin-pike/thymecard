import express from 'express';
import { IUserController } from '../../components/user/user.controller';
import { IRecipeController } from '../../components/recipe/recipe.controller';
import { IDayController } from '../../components/day/day.controller';
import { IPantryController } from '../../components/pantry/pantry.controller';
import { IStockController } from '../../components/stock/stock.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { ContextMiddleware } from '../../middleware/context.middleware';
import { ErrorsMiddleware } from '../../middleware/error.middleware';
import { RateLimiterMiddleware } from '../../middleware/rate-limiter.middleware';
import { ThymecardEnvironment } from '../../../env';
import { ICredentialController } from '../../components/auth/credential/credential.controller';
import { IOAuthController } from '../../components/auth/oauth/oauth.controller';
import { ISessionController } from '../../components/auth/session/session.controller';
import { IEventBookmarkController } from '../../components/eventBookmark/eventBookmark.controller';

export interface IDependencies {
    env: ThymecardEnvironment;
    oauthController: IOAuthController;
    credentialController: ICredentialController;
    sessionController: ISessionController;
    userController: IUserController;
    recipeController: IRecipeController;
    dayController: IDayController;
    pantryController: IPantryController;
    stockController: IStockController;
    eventBookmarkController: IEventBookmarkController;
}

type routers = 'auth' | 'user' | 'recipe' | 'day' | 'pantry' | 'stock' | 'eventBookmark';

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
