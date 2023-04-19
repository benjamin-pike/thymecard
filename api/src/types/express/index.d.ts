import { Logger } from 'winston';

declare module 'express-serve-static-core' {
    export interface Request {
        context: {
            requestId: string;
            url: string;
            deviceId: string;
            logger: Logger;
        };
    }
}
