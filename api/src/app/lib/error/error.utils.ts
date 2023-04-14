import { ZodError, ZodIssue } from 'zod';
import { SironaError } from './sironaError';

export const formatZodError = (err: ZodError) => {
    return `Error${err.errors.length > 1 ? 's' : ''} at ${err.errors
        .map((issue: ZodIssue) => {
            const path = issue.path.join('.');
            const message = issue.message.toLowerCase();

            return `${path} (${message})`;
        })
        .join('; ')}`;
};

export const enrichError = (err: unknown, context: any) => {
    if (!(err instanceof SironaError)) {
        return err;
    }

    return err.enrich({
        requestId: context.requestId,
        url: context.path
    });
};
