import { RequestContext } from '../../app/middleware/context.middleware';

declare module 'express-serve-static-core' {
    export interface Request {
        context: RequestContext
    }
}
