import { isString, isValidMongoId } from '../../lib/types/types.utils';

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshTokenEntity {
    key: string; // TEMPLATE: refreshToken::<deviceId>
    token: string;
    userId: string;
}

export interface IRefreshTokenPayload {
    userId: string;
    email: string;
}

export const isRefreshTokenPayload = (obj: any): obj is IRefreshTokenPayload => {
    return obj && isValidMongoId(obj.userId) && isString(obj.email) && isString(obj.deviceId);
};

export interface IGoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
    hd: string;
}
