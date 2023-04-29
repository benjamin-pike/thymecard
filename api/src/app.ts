import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { establishMongoConnection } from './app/lib/database/mongo.utils';
import { Server } from './server';
import { LRUCache } from 'lru-cache';
import { UserService } from './app/components/user/user.service';
import { UserController } from './app/components/user/user.controller';
import { UserCache } from './app/lib/types/cache.types';
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

dotenv.config();

const getEnvironmentVariable = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} must be defined`);
    }
    return value;
};

const start = async () => {
    // Environment variables
    const nodeEnv = getEnvironmentVariable('NODE_ENV');
    const rootUrl = getEnvironmentVariable('ROOT_URL');
    const mongoConnectionString = getEnvironmentVariable('MONGO_URI');
    const redisHost = getEnvironmentVariable('REDIS_HOST');
    const redisPort = parseInt(getEnvironmentVariable('REDIS_PORT'), 10);
    const redisPassword = getEnvironmentVariable('REDIS_PASSWORD');
    const jwtAccessSecret = getEnvironmentVariable('JWT_ACCESS_SECRET');
    const jwtRefreshSecret = getEnvironmentVariable('JWT_REFRESH_SECRET');
    const googleClientId = getEnvironmentVariable('GOOGLE_CLIENT_ID');
    const googleClientSecret = getEnvironmentVariable('GOOGLE_CLIENT_SECRET');
    const facebookAppId = getEnvironmentVariable('FACEBOOK_APP_ID');
    const facebookAppSecret = getEnvironmentVariable('FACEBOOK_APP_SECRET');

    // Caches
    const userCacheItems = 1000;
    const userCacheAge = 5 * 60 * 1000; // 5 minutes
    const userCache: UserCache = new LRUCache({
        max: userCacheItems,
        ttl: userCacheAge
    });

    // Database connections
    const redisRepository = new RedisRepository({ host: redisHost, port: redisPort, password: redisPassword });
    await redisRepository.connect();
    await establishMongoConnection(mongoConnectionString);

    // Services
    const authService = new AuthService({
        redisRepository,
        jwtAccessSecret,
        jwtRefreshSecret,
        googleConfig: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            redirectUrl: `${rootUrl}/auth/google/callback`
        },
        facebookAuthConfig: {
            clientId: facebookAppId,
            clientSecret: facebookAppSecret,
            redirectUrl: `${rootUrl}/auth/facebook/callback`,
            state: uuid.v4()
        }
    });
    const userService = new UserService({ userCache, authService });
    const recipeService = new RecipeService();

    // Controllers
    const authController = new AuthController({ authService, userService });
    const userController = new UserController({ userService });
    const recipeController = new RecipeController({ recipeService });

    const dependencies = {
        authController,
        userController,
        recipeController
    };

    // ACLs
    const resourcePermissions: IResourcePermissions = {
        auth: authPermissions,
        users: userPermissions,
        recipes: recipePermissions
    }

    // Middleware
    const middleware = {
        context: createContextMiddleware(nodeEnv, resourcePermissions),
        auth: createAuthMiddleware(jwtAccessSecret, resourcePermissions),
        errors: errorsMiddleware
    };

    // Routers
    const routers = {
        auth: authRouter(dependencies),
        user: userRouter(dependencies),
        recipe: recipeRouter(dependencies)
    };

    const server = new Server(routers, middleware);

    server
        .initMiddleware()
        .initAnonymousRoutes()
        .initAuthenticatedRoutes()
        .initErrorHandler()
        .start();
};

start();
