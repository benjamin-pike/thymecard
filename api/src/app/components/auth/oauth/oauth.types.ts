import { isBoolean, isOptional, isString } from '@thymecard/types';

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
