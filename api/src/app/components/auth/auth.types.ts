import { isBoolean, isOptional, isString, isValidMongoId, isRecord, isNumber } from '../../lib/types/types.utils';

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshTokenEntity {
    key: string; // TEMPLATE: refreshToken::<deviceId>
    token: string;
    userId: string;
}

export interface IAccessTokenPayload {
    userId: string;
    permissions: Record<string, number>;
}

export interface IRefreshTokenPayload {
    userId: string;
}

export const isAccessTokenPayload = (obj: any): obj is IAccessTokenPayload => {
    return obj && isValidMongoId(obj.userId) && isRecord(obj.permissions, isNumber);
};

export const isRefreshTokenPayload = (obj: any): obj is IRefreshTokenPayload => {
    return obj && isValidMongoId(obj.userId);
};

export interface IGoogleUser {
    id: string;
    given_name: string;
    family_name: string;
    name: string;
    email: string;
    verified_email: boolean;
    picture: string;
    locale: string;
}

export interface IFacebookUser {
    id: string;
    email?: string;
    first_name: string;
    last_name: string;
}

export const isGoogleUser = (obj: any): obj is IGoogleUser => {
    return (
        obj &&
        isString(obj.id) &&
        isString(obj.given_name) &&
        isString(obj.family_name) &&
        isString(obj.name) &&
        isString(obj.email) &&
        isBoolean(obj.verified_email) &&
        isString(obj.picture) &&
        isString(obj.locale)
    );
};

export const isFacebookUser = (obj: any): obj is IFacebookUser => {
    return obj && isString(obj.id) && isString(obj.first_name) && isString(obj.last_name) && isOptional(isString, obj.email);
};
