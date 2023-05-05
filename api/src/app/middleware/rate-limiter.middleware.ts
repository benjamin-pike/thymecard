import express from 'express';
import { RateLimiter, Interval } from 'limiter';
import { TooManyRequestsError } from '../lib/error/sironaError';
import { ErrorCode } from '../lib/error/errorCode';
import { isNumber } from '../lib/types/typeguards.utils';

interface IRateLimiterConfig {
    tokensPerInterval: number;
    interval: Interval;
}

export type RateLimiterMiddleware = ReturnType<typeof createRateLimiterMiddleware>;

export const createRateLimiterMiddleware = (config: IRateLimiterConfig, cooldownPeriod: number) => {
    const limiters: Map<string, RateLimiter> = new Map();
    const banned: Map<string, number> = new Map();

    return (req: express.Request, _res: express.Response, next: express.NextFunction) => {
        const ip = req.ip;
        const userId = req.context.isAuthenticated ? req.context.getAuthContext().userId : undefined;
        const identifier = userId ?? ip;

        if (!limiters.has(identifier)) {
            limiters.set(identifier, new RateLimiter(config));
        }

        const now = Date.now();
        const bannedUntil = banned.get(identifier);

        if (bannedUntil) {
            if (bannedUntil > now) {
                throw new TooManyRequestsError(ErrorCode.TooManyRequests, 'Too many requests; please try again later', {
                    origin: 'middleware.rate-limiter.ts'
                });
            }

            banned.delete(identifier);
        }
        
        const limiter = limiters.get(identifier);

        if (limiter && !limiter.tryRemoveTokens(1)) {
            banned.set(identifier, now + cooldownPeriod);
            throw new TooManyRequestsError(ErrorCode.TooManyRequests, 'Too many requests; please try again later', {
                origin: 'middleware.rate-limiter.ts'
            });
        } else {
            next();
        }
    };
};

export const isRateLimiterInterval = (val: any): val is Interval => {
    return (
        isNumber(val) ||
        val === 'second' ||
        val === 'minute' ||
        val === 'hour' ||
        val === 'day' ||
        val === 'week' ||
        val === 'month' ||
        val === 'year'
    );
};
