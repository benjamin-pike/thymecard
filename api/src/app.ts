import * as dotenv from 'dotenv';
import { establishMongoConnection } from './app/lib/database/mongo.utils';
import { Server } from './server';
import { LRUCache } from 'lru-cache';
import { UserService } from './app/components/user/user.service';
import { UserController } from './app/components/user/user.controller';
import { UserCache } from './app/lib/types/cache.types';

dotenv.config();

const start = () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    // Initialize caches
    const userCacheItems = 1000;
    const userCacheAge = 5 * 60 * 1000; // 5 minutes
    const userCache: UserCache = new LRUCache({
        max: userCacheItems,
        ttl: userCacheAge
    });

    // Initialize services
    const userService = new UserService({ userCache });

    // initialize controllers
    const userController = new UserController(userService);

    establishMongoConnection(process.env.MONGO_URI);

    const dependencies = {
        userController
    };

    const server = new Server(dependencies);

    server.initMiddleware();
    server.initRoutes();
    server.initErrorHandler();
    server.start();
};

start();
