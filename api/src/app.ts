import { env } from './env';
import * as uuid from 'uuid';
import { establishMongoConnection } from './app/lib/data/mongo.utils';
import { Server } from './server';
import { LRUCache } from 'lru-cache';
import { UserService } from './app/components/user/user.service';
import { UserController } from './app/components/user/user.controller';
import { DayCache, RecipeCache, RecipeSummaryCache, UserCache } from './app/lib/types/cache.types';
import { userPermissions, userRouter } from './app/components/user/user.router';
import { AuthService } from './app/components/auth/auth.service';
import { AuthController } from './app/components/auth/auth.controller';
import { authRouter, authPermissions } from './app/components/auth/auth.router';
import { RedisRepository } from './app/lib/data/redis.repository';
import { createAuthMiddleware } from './app/middleware/auth.middleware';
import { errorsMiddleware } from './app/middleware/error.middleware';
import { createContextMiddleware } from './app/middleware/context.middleware';
import { IResourcePermissions } from './app/lib/auth/permissions';
import { RecipeService } from './app/components/recipe/recipe.service';
import { RecipeController } from './app/components/recipe/recipe.controller';
import { recipePermissions, recipeRouter } from './app/components/recipe/recipe.router';
import { DayService } from './app/components/day/day.service';
import { DayController } from './app/components/day/day.controller';
import { dayPermissions, dayRouter } from './app/components/day/day.router';
import { parseFloatOrNull } from './app/lib/types/typeguards.utils';
import { createRateLimiterMiddleware } from './app/middleware/rate-limiter.middleware';
import { PrismaClient } from '@prisma/client';
import { PantryService } from './app/components/pantry/pantry.service';
import { PantryController } from './app/components/pantry/pantry.controller';
import { pantryPermissions, pantryRouter } from './app/components/pantry/pantry.router';
import { S3Repository } from './app/lib/data/s3.repository';

// Initialize server
(async () => {
    // Caches
    const userCache: UserCache = new LRUCache({
        max: parseFloatOrNull(env.USER_CACHE_MAX_ITEMS) ?? 100,
        ttl: parseFloatOrNull(env.USER_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    const recipeCache: RecipeCache = new LRUCache({
        max: parseFloatOrNull(env.RECIPE_CACHE_MAX_ITEMS) ?? 100,
        ttl: parseFloatOrNull(env.RECIPE_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    const recipeSummaryCache: RecipeSummaryCache = new LRUCache({
        max: parseFloatOrNull(env.RECIPE_SUMMARY_CACHE_MAX_ITEMS) ?? 1000,
        ttl: parseFloatOrNull(env.RECIPE_SUMMARY_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    const dayCache: DayCache = new LRUCache({
        max: parseFloatOrNull(env.PLANNER_CACHE_MAX_ITEMS) ?? 100,
        ttl: parseFloatOrNull(env.PLANNER_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    // Database connections
    const redisRepository = new RedisRepository(env.REDIS_CONNECTION_STRING);
    await redisRepository.connect();
    await establishMongoConnection(env.MONGO_CONNECTION_STRING);
    const s3Repository = new S3Repository(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY, env.AWS_REGION, env.S3_BUCKET_NAME);
    const prismaClient = new PrismaClient();

    // Services
    const authService = new AuthService({
        redisRepository,
        jwtAccessSecret: env.JWT_ACCESS_SECRET,
        jwtRefreshSecret: env.JWT_REFRESH_SECRET,
        googleConfig: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            redirectUrl: `${env.ROOT_URL}/auth/google/callback`
        },
        facebookAuthConfig: {
            clientId: env.FACEBOOK_APP_ID,
            clientSecret: env.FACEBOOK_APP_SECRET,
            redirectUrl: `${env.ROOT_URL}/auth/facebook/callback`,
            state: uuid.v4()
        }
    });
    const userService = new UserService({ userCache, authService });
    const recipeService = new RecipeService({ recipeCache, recipeSummaryCache, s3Repository });
    const dayService = new DayService({ dayCache });
    const pantryService = new PantryService({ prismaClient });

    // Controllers
    const authController = new AuthController({ authService, userService });
    const userController = new UserController({ userService });
    const recipeController = new RecipeController({ recipeService });
    const dayController = new DayController({ dayService });
    const pantryController = new PantryController({ pantryService });

    const dependencies = {
        authController,
        userController,
        recipeController,
        dayController,
        pantryController
    };

    // Permissions
    const basePermissions = {
        '': { 'GET /': [] },
        proxy: { 'GET /proxy': [] }
    };

    const resourcePermissions: IResourcePermissions = {
        ...basePermissions,
        auth: authPermissions,
        users: userPermissions,
        recipes: recipePermissions,
        days: dayPermissions,
        pantry: pantryPermissions
    };

    // Middleware
    const middleware = {
        context: createContextMiddleware(env.NODE_ENV, resourcePermissions),
        auth: createAuthMiddleware(env.JWT_ACCESS_SECRET, resourcePermissions),
        errors: errorsMiddleware,
        anonRateLimiter: createRateLimiterMiddleware(
            { tokensPerInterval: env.ANON_LIMITER_TOKENS, interval: env.ANON_LIMITER_INTERVAL },
            env.ANON_LIMITER_COOLDOWN
        ),
        authRateLimiter: createRateLimiterMiddleware(
            { tokensPerInterval: env.AUTH_LIMITER_TOKENS, interval: env.AUTH_LIMITER_INTERVAL },
            env.AUTH_LIMITER_COOLDOWN
        )
    };

    // Routers
    const routers = {
        auth: authRouter(dependencies),
        user: userRouter(dependencies),
        recipe: recipeRouter(dependencies),
        day: dayRouter(dependencies),
        pantry: pantryRouter(dependencies)
    };

    const server = new Server(routers, middleware);

    server.initMiddleware().initAnonymousRoutes().initAuthenticatedRoutes().initErrorHandler().start();
})();
