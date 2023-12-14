import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { logger } from './app/common/logger';
import { IMiddleware, IRouters } from './app/lib/types/server.types';
import axios from 'axios';

export class Server {
    public server!: http.Server;
    public application: express.Application;
    private routers: IRouters;
    private middleware: IMiddleware;

    constructor(routers: IRouters, middleware: IMiddleware) {
        this.application = express();
        this.routers = routers;
        this.middleware = middleware;
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
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended: true }));
        this.application.use(cookieParser());
        this.application.use(this.middleware.context);
        this.application.use(this.middleware.anonRateLimiter);

        return this;
    }

    public initAnonymousRoutes() {
        this.application.get('/', (_req, res) => {
            res.json({
                name: 'Thymecard API',
                description: 'The RESTful API that provides access to the Thymecard data model',
                version: '1.0.0',
                now: new Date().toISOString()
            });
        });

        this.application.get('/proxy', async (req, res) => {
            try {
                const targetUrl = req.query.url as string;
                const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
                res.setHeader('content-type', response.headers['content-type']);
                res.send(response.data);
            } catch (error) {
                res.status(500).send('An error occurred while fetching the image.');
            }
        });

        return this;
    }

    public initAuthenticatedRoutes() {
        this.application.use(this.middleware.auth);
        this.application.use(this.middleware.authRateLimiter);

        this.application.use('/auth', this.routers.auth);
        this.application.use('/users', this.routers.user);
        this.application.use('/recipes', this.routers.recipe);
        this.application.use('/days', this.routers.day);
        this.application.use('/pantry', this.routers.pantry);
        this.application.use('/stock', this.routers.stock);

        return this;
    }

    public initErrorHandler() {
        this.application.use(this.middleware.errors);

        return this;
    }
}
