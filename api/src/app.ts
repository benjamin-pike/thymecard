import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { establishMongoConnection } from './app/lib/database/mongo.utils';
import { Server } from './server';
import { LRUCache } from 'lru-cache';
import { UserService } from './app/components/user/user.service';
import { UserController } from './app/components/user/user.controller';
import { DayCache, RecipeCache, RecipeSummaryCache, UserCache } from './app/lib/types/cache.types';
import { userPermissions, userRouter } from './app/components/user/user.router';
import { AuthService } from './app/components/auth/auth.service';
import { AuthController } from './app/components/auth/auth.controller';
import { authRouter, authPermissions } from './app/components/auth/auth.router';
import { RedisRepository } from './app/lib/database/redis.repository';
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
import { createEncryptionUtils } from './app/lib/encryption.utils';

dotenv.config();

const getEnvironmentVariable = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} must be defined`);
    }
    return value;
};

// Environment variables
const NODE_ENV = getEnvironmentVariable('NODE_ENV');
const ROOT_URL = getEnvironmentVariable('ROOT_URL');
const MONGO_CONNECTION_STRING = getEnvironmentVariable('MONGO_URI');
const REDIS_HOST = getEnvironmentVariable('REDIS_HOST');
const REDIS_PORT = parseInt(getEnvironmentVariable('REDIS_PORT'), 10);
const REDIS_PASSWORD = getEnvironmentVariable('REDIS_PASSWORD');
const JWT_ACCESS_SECRET = getEnvironmentVariable('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = getEnvironmentVariable('JWT_REFRESH_SECRET');
const GOOGLE_CLIENT_ID = getEnvironmentVariable('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = getEnvironmentVariable('GOOGLE_CLIENT_SECRET');
const FACEBOOK_APP_ID = getEnvironmentVariable('FACEBOOK_APP_ID');
const FACEBOOK_APP_SECRET = getEnvironmentVariable('FACEBOOK_APP_SECRET');
const AES_ENCRYPTION_KEY = getEnvironmentVariable('AES_ENCRYPTION_KEY');

(async () => {
    // Caches
    const userCache: UserCache = new LRUCache({
        max: parseFloatOrNull(process.env.USER_CACHE_MAX_ITEMS) ?? 100,
        ttl: parseFloatOrNull(process.env.USER_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    const recipeCache: RecipeCache = new LRUCache({
        max: parseFloatOrNull(process.env.RECIPE_CACHE_MAX_ITEMS) ?? 100,
        ttl: parseFloatOrNull(process.env.RECIPE_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    const recipeSummaryCache: RecipeSummaryCache = new LRUCache({
        max: parseFloatOrNull(process.env.RECIPE_SUMMARY_CACHE_MAX_ITEMS) ?? 1000,
        ttl: parseFloatOrNull(process.env.RECIPE_SUMMARY_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    const dayCache: DayCache = new LRUCache({
        max: parseFloatOrNull(process.env.PLANNER_CACHE_MAX_ITEMS) ?? 100,
        ttl: parseFloatOrNull(process.env.PLANNER_CACHE_MAX_AGE) ?? 5 * 60 * 1000 // 5 minutes
    });

    // Database connections
    const redisRepository = new RedisRepository({ host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD });
    await redisRepository.connect();
    await establishMongoConnection(MONGO_CONNECTION_STRING);

    // Services
    const authService = new AuthService({
        redisRepository,
        jwtAccessSecret: JWT_ACCESS_SECRET,
        jwtRefreshSecret: JWT_REFRESH_SECRET,
        googleConfig: {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            redirectUrl: `${ROOT_URL}/auth/google/callback`
        },
        facebookAuthConfig: {
            clientId: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            redirectUrl: `${ROOT_URL}/auth/facebook/callback`,
            state: uuid.v4()
        }
    });
    const userService = new UserService({ userCache, authService });
    const recipeService = new RecipeService({ recipeCache, recipeSummaryCache });
    const dayService = new DayService({ dayCache });

    // Controllers
    const authController = new AuthController({ authService, userService });
    const userController = new UserController({ userService });
    const recipeController = new RecipeController({ recipeService });
    const dayController = new DayController({ dayService });

    const dependencies = {
        authController,
        userController,
        recipeController,
        dayController
    };

    // Permissions
    const resourcePermissions: IResourcePermissions = {
        auth: authPermissions,
        users: userPermissions,
        recipes: recipePermissions,
        days: dayPermissions
    };

    // Middleware
    const middleware = {
        context: createContextMiddleware(NODE_ENV, resourcePermissions),
        auth: createAuthMiddleware(JWT_ACCESS_SECRET, resourcePermissions),
        errors: errorsMiddleware
    };

    // Routers
    const routers = {
        auth: authRouter(dependencies),
        user: userRouter(dependencies),
        recipe: recipeRouter(dependencies),
        day: dayRouter(dependencies)
    };

    const server = new Server(routers, middleware);

    server.initMiddleware().initAnonymousRoutes().initAuthenticatedRoutes().initErrorHandler().start();
})();

// Initialize utiliy functions that require environment variables
export const { compressAndEncrypt, decryptAndDecompress } = createEncryptionUtils(AES_ENCRYPTION_KEY);
