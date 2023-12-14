import * as dotenv from 'dotenv';
import { isNumber, validate } from './app/lib/types/typeguards.utils';
import { isRateLimiterInterval } from './app/middleware/rate-limiter.middleware';
import { InternalError } from './app/lib/error/thymecardError';
import { ErrorCode } from '@thymecard/types';

dotenv.config();

const getEnvironmentVariable = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new InternalError(ErrorCode.InternalError, `${key} must be defined`, {
            origin: 'getEnvironmentVariable',
            data: { key }
        });
    }
    return value;
};

// Get non-string environment variables
const ANON_LIMITER_TOKENS = getEnvironmentVariable('ANON_LIMITER_TOKENS');
const AUTH_LIMITER_TOKENS = getEnvironmentVariable('AUTH_LIMITER_TOKENS');
const ANON_LIMITER_INTERVAL = getEnvironmentVariable('ANON_LIMITER_INTERVAL');
const AUTH_LIMITER_INTERVAL = getEnvironmentVariable('AUTH_LIMITER_INTERVAL');
const ANON_LIMITER_COOLDOWN_SECS = getEnvironmentVariable('ANON_LIMITER_COOLDOWN_SECS');
const AUTH_LIMITER_COOLDOWN_SECS = getEnvironmentVariable('AUTH_LIMITER_COOLDOWN_SECS');

const stringVariables = {
    NODE_ENV: getEnvironmentVariable('NODE_ENV'),
    ROOT_URL: getEnvironmentVariable('ROOT_URL'),
    CLIENT_URL: getEnvironmentVariable('CLIENT_URL'),
    MONGO_CONNECTION_STRING: getEnvironmentVariable('MONGO_URI'),
    REDIS_CONNECTION_STRING: getEnvironmentVariable('REDIS_URI'),
    JWT_ACCESS_SECRET: getEnvironmentVariable('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: getEnvironmentVariable('JWT_REFRESH_SECRET'),
    GOOGLE_CLIENT_ID: getEnvironmentVariable('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getEnvironmentVariable('GOOGLE_CLIENT_SECRET'),
    FACEBOOK_APP_ID: getEnvironmentVariable('FACEBOOK_APP_ID'),
    FACEBOOK_APP_SECRET: getEnvironmentVariable('FACEBOOK_APP_SECRET'),
    AES_ENCRYPTION_KEY: getEnvironmentVariable('AES_ENCRYPTION_KEY'),
    AWS_ACCESS_KEY_ID: getEnvironmentVariable('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY: getEnvironmentVariable('AWS_SECRET_ACCESS_KEY'),
    AWS_REGION: getEnvironmentVariable('AWS_REGION'),
    S3_BUCKET_NAME: getEnvironmentVariable('S3_BUCKET_NAME'),
    SENDGRID_API_KEY: getEnvironmentVariable('SENDGRID_API_KEY'),
    SENDGRID_EMAIL: getEnvironmentVariable('SENDGRID_EMAIL')
} as const;

const nonStringVariables = {
    // REDIS_PORT: validate(parseInt(REDIS_PORT), isNumber, new Error('REDIS_PORT must be a number')),
    ANON_LIMITER_TOKENS: validate(parseInt(ANON_LIMITER_TOKENS), isNumber, new Error('ANON_LIMITER_TOKENS must be a number')),
    AUTH_LIMITER_TOKENS: validate(parseInt(AUTH_LIMITER_TOKENS), isNumber, new Error('AUTH_LIMITER_TOKENS must be a number')),
    ANON_LIMITER_INTERVAL: validate(
        validate(parseInt(ANON_LIMITER_INTERVAL), isNumber) ?? ANON_LIMITER_INTERVAL,
        isRateLimiterInterval,
        new Error('ANON_LIMITER_INTERVAL must be a valid rate limiter interval')
    ),
    AUTH_LIMITER_INTERVAL: validate(
        validate(parseInt(AUTH_LIMITER_INTERVAL), isNumber) ?? AUTH_LIMITER_INTERVAL,
        isRateLimiterInterval,
        new Error('AUTH_LIMITER_INTERVAL must be a valid rate limiter interval')
    ),
    ANON_LIMITER_COOLDOWN: validate(
        parseInt(ANON_LIMITER_COOLDOWN_SECS),
        isNumber,
        new Error('ANON_LIMITER_COOLDOWN must be a number'),
        (n) => n * 1000
    ),
    AUTH_LIMITER_COOLDOWN: validate(
        parseInt(AUTH_LIMITER_COOLDOWN_SECS),
        isNumber,
        new Error('AUTH_LIMITER_COOLDOWN must be a number'),
        (n) => n * 1000
    )
} as const;

const optionalVariables = {
    OAUTH_NONCE_CACHE_MAX_ITEMS: process.env.OAUTH_NONCE_CACHE_MAX_ITEMS,
    OAUTH_NONCE_CACHE_MAX_AGE: process.env.OAUTH_NONCE_CACHE_MAX_AGE,
    USER_CACHE_MAX_ITEMS: process.env.USER_CACHE_MAX_ITEMS,
    USER_CACHE_MAX_AGE: process.env.USER_CACHE_MAX_AGE,
    RECIPE_CACHE_MAX_ITEMS: process.env.RECIPE_CACHE_MAX_ITEMS,
    RECIPE_CACHE_MAX_AGE: process.env.RECIPE_CACHE_MAX_AGE,
    RECIPE_SUMMARY_CACHE_MAX_ITEMS: process.env.RECIPE_SUMMARY_CACHE_MAX_ITEMS,
    RECIPE_SUMMARY_CACHE_MAX_AGE: process.env.RECIPE_SUMMARY_CACHE_MAX_AGE,
    PLANNER_CACHE_MAX_ITEMS: process.env.PLANNER_CACHE_MAX_ITEMS,
    PLANNER_CACHE_MAX_AGE: process.env.PLANNER_CACHE_MAX_AGE,
    SESSION_CACHE_MAX_ITEMS: process.env.SESSION_CACHE_MAX_ITEMS,
    SESSION_CACHE_MAX_AGE: process.env.SESSION_CACHE_MAX_AGE,
    TOKEN_CACHE_MAX_ITEMS: process.env.TOKEN_CACHE_MAX_ITEMS,
    TOKEN_CACHE_MAX_AGE: process.env.TOKEN_CACHE_MAX_AGE
} as const;

export const env = { ...stringVariables, ...nonStringVariables, ...optionalVariables };

export type ThymecardEnvironment = typeof env;
