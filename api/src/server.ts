import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { logger } from './app/common/logger';
import { addCallContext } from './app/middleware/context.middleware';
import { UserController } from './app/components/user/user.controller';
import { userRouter } from './app/components/user/user.router';
import { errorHandler } from './app/middleware/error.middleware';
import { AuthController } from './app/components/auth/auth.controller';
import { authRouter } from './app/components/auth/auth.router';

export interface IDependencies {
    authController: AuthController;
    userController: UserController;
}

export class Server {
    public server!: http.Server;
    public application: express.Application;
    private dependencies: IDependencies;

    constructor(dependencies: IDependencies) {
        this.application = express();
        this.dependencies = dependencies;
    }

    public start() {
        const port = process.env.PORT || 9000;
        this.server = this.application.listen(port, () => {
            if (process.env.NODE_ENV === 'dev') {
                console.log(`Server listening on ${port}`);
            }
            logger.info(`Server listening on ${port}`);
        });
    }

    public stop() {
        this.server.close((err) => {
            if (err) {
                logger.error('Error closing server:', err);
            }
        });
    }

    public initMiddleware() {
        this.application.get('/', (_req, res) => {
            res.json({
                name: 'Sirona API',
                description: 'The RESTful API that provides access to the Sirona data model',
                version: '1.0.0',
                now: new Date().toISOString()
            });
        });

        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended: true }));
        this.application.use(cookieParser());
        this.application.use(addCallContext);

        return this;
    }

    public initRoutes() {
        this.application.use('/auth', authRouter(this.dependencies));
        this.application.use('/users', userRouter(this.dependencies));
        return this;
    }

    public initErrorHandler() {
        this.application.use(errorHandler);
        return this;
    }
}
