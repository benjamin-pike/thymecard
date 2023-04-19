import * as dotenv from 'dotenv';
import { establishMongoConnection } from './app/lib/database/mongo.utils';
import { Server } from './server';
import { LRUCache } from 'lru-cache';
import { UserService } from './app/components/user/user.service';
import { UserController } from './app/components/user/user.controller';
import { UserCache } from './app/lib/types/cache.types';
import { AuthService } from './app/components/auth/auth.service';
import { AuthController } from './app/components/auth/auth.controller';
import { RedisRepository } from './app/lib/database/redis.repository';

dotenv.config();

const start = async () => {
    const rootUrl = process.env.ROOT_URL;
    if (!rootUrl) {
        throw new Error('ROOT_URL must be defined');
    }

    const mongoConnectionString = process.env.MONGO_URI;
    if (!mongoConnectionString) {
        throw new Error('MONGO_URI must be defined');
    }

    const redisHost = process.env.REDIS_HOST;
    if (!redisHost) {
        throw new Error('REDIS_HOST must be defined');
    }

    const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined;
    if (!redisPort) {
        throw new Error('REDIS_PORT must be defined');
    }

    const redisPassword = process.env.REDIS_PASSWORD;
    if (!redisPassword) {
        throw new Error('REDIS_PASSWORD must be defined');
    }

    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtAccessSecret) {
        throw new Error('JWT_ACCESS_SECRET must be defined');
    }

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) {
        throw new Error('JWT_REFRESH_SECRET must be defined');
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
        throw new Error('GOOGLE_CLIENT_ID must be defined');
    }

    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!googleClientSecret) {
        throw new Error('GOOGLE_CLIENT_SECRET must be defined');
    }

    // Initialize caches
    const userCacheItems = 1000;
    const userCacheAge = 5 * 60 * 1000; // 5 minutes
    const userCache: UserCache = new LRUCache({
        max: userCacheItems,
        ttl: userCacheAge
    });

    // Initialize database connections
    const redisRepository = new RedisRepository({ host: redisHost, port: redisPort, password: redisPassword });
    await redisRepository.connect();
    await establishMongoConnection(mongoConnectionString);

    // Initialize services
    const authService = new AuthService({
        redisRepository,
        jwtAccessSecret,
        jwtRefreshSecret,
        googleConfig: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            redirectUrl: `${rootUrl}/auth/google/callback`
        }
    });
    const userService = new UserService({ userCache, authService });

    // Initialize controllers
    const authController = new AuthController({ authService, userService });
    const userController = new UserController({ userService });

    const dependencies = {
        authController,
        userController
    };

    const server = new Server(dependencies);

    server.initMiddleware();
    server.initRoutes();
    server.initErrorHandler();
    server.start();
};

start();
