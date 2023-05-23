import * as dotenv from 'dotenv';
import { isNumber, validateWithError, validateWithNull } from "./app/lib/types/typeguards.utils";
import { isRateLimiterInterval } from "./app/middleware/rate-limiter.middleware";
import { ErrorCode } from './app/lib/error/errorCode';
import { InternalError } from './app/lib/error/sironaError';

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
const REDIS_PORT = getEnvironmentVariable('REDIS_PORT');
const ANON_LIMITER_TOKENS = getEnvironmentVariable('ANON_LIMITER_TOKENS');
const AUTH_LIMITER_TOKENS = getEnvironmentVariable('AUTH_LIMITER_TOKENS');
const ANON_LIMITER_INTERVAL = getEnvironmentVariable('ANON_LIMITER_INTERVAL');
const AUTH_LIMITER_INTERVAL = getEnvironmentVariable('AUTH_LIMITER_INTERVAL');
const ANON_LIMITER_COOLDOWN_SECS = getEnvironmentVariable('ANON_LIMITER_COOLDOWN_SECS');
const AUTH_LIMITER_COOLDOWN_SECS = getEnvironmentVariable('AUTH_LIMITER_COOLDOWN_SECS');

const stringVariables = {
    NODE_ENV: getEnvironmentVariable('NODE_ENV'),
    ROOT_URL: getEnvironmentVariable('ROOT_URL'),
    MONGO_CONNECTION_STRING: getEnvironmentVariable('MONGO_URI'),
    REDIS_HOST: getEnvironmentVariable('REDIS_HOST'),
    REDIS_PASSWORD: getEnvironmentVariable('REDIS_PASSWORD'),
    JWT_ACCESS_SECRET: getEnvironmentVariable('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: getEnvironmentVariable('JWT_REFRESH_SECRET'),
    GOOGLE_CLIENT_ID: getEnvironmentVariable('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getEnvironmentVariable('GOOGLE_CLIENT_SECRET'),
    FACEBOOK_APP_ID: getEnvironmentVariable('FACEBOOK_APP_ID'),
    FACEBOOK_APP_SECRET: getEnvironmentVariable('FACEBOOK_APP_SECRET'),
    AES_ENCRYPTION_KEY: getEnvironmentVariable('AES_ENCRYPTION_KEY')
} as const;

const nonStringVariables = {
    REDIS_PORT: validateWithError(parseInt(REDIS_PORT), isNumber, new Error('REDIS_PORT must be a number')),
    ANON_LIMITER_TOKENS: validateWithError(
        parseInt(ANON_LIMITER_TOKENS),
        isNumber,
        new Error('ANON_LIMITER_TOKENS must be a number')
    ),
    AUTH_LIMITER_TOKENS: validateWithError(
        parseInt(AUTH_LIMITER_TOKENS),
        isNumber,
        new Error('AUTH_LIMITER_TOKENS must be a number')
    ),
    ANON_LIMITER_INTERVAL: validateWithError(
        validateWithNull(parseInt(ANON_LIMITER_INTERVAL), isNumber) ?? ANON_LIMITER_INTERVAL,
        isRateLimiterInterval,
        new Error('ANON_LIMITER_INTERVAL must be a valid rate limiter interval')
    ),
    AUTH_LIMITER_INTERVAL: validateWithError(
        validateWithNull(parseInt(AUTH_LIMITER_INTERVAL), isNumber) ?? AUTH_LIMITER_INTERVAL,
        isRateLimiterInterval,
        new Error('AUTH_LIMITER_INTERVAL must be a valid rate limiter interval')
    ),
    ANON_LIMITER_COOLDOWN:
        validateWithError(parseInt(ANON_LIMITER_COOLDOWN_SECS), isNumber, new Error('ANON_LIMITER_COOLDOWN must be a number')) *
        1000,
    AUTH_LIMITER_COOLDOWN:
        validateWithError(parseInt(AUTH_LIMITER_COOLDOWN_SECS), isNumber, new Error('AUTH_LIMITER_COOLDOWN must be a number')) * 1000
} as const;

const optionalVariables = {
    USER_CACHE_MAX_ITEMS: process.env.USER_CACHE_MAX_ITEMS,
    USER_CACHE_MAX_AGE: process.env.USER_CACHE_MAX_AGE,
    RECIPE_CACHE_MAX_ITEMS: process.env.RECIPE_CACHE_MAX_ITEMS,
    RECIPE_CACHE_MAX_AGE: process.env.RECIPE_CACHE_MAX_AGE,
    RECIPE_SUMMARY_CACHE_MAX_ITEMS: process.env.RECIPE_SUMMARY_CACHE_MAX_ITEMS,
    RECIPE_SUMMARY_CACHE_MAX_AGE: process.env.RECIPE_SUMMARY_CACHE_MAX_AGE,
    PLANNER_CACHE_MAX_ITEMS: process.env.PLANNER_CACHE_MAX_ITEMS,
    PLANNER_CACHE_MAX_AGE: process.env.PLANNER_CACHE_MAX_AGE
} as const

export const env = { ...stringVariables, ...nonStringVariables, ...optionalVariables };
