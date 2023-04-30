import * as z from 'zod';

export interface IUser {
    _id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    dob?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    authProvider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE';
    OAuthId?: string;
    deleted?: boolean;
}

interface ILocalUser extends IUser {
    lastName: string;
    password: string;
    authProvider: 'LOCAL';
}

export type IOAuthUserCreate = Pick<IUser, 'firstName' | 'lastName' | 'OAuthId' | 'email' | 'authProvider'>;
export type ILocalUserCreate = Omit<ILocalUser, '_id' | 'authProvider' | 'deleted'>;

export type IUserUpdate = Partial<IUser>;

export enum AuthProvider {
    Local = 'LOCAL',
    Google = 'GOOGLE',
    Facebook = 'FACEBOOK',
    Apple = 'APPLE'
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const createLocalUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8).regex(passwordRegex),
    phoneNumber: z.string().optional(),
    dob: z.date().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'])
});

export const createOAuthUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    OAuthId: z.string(),
    authProvider: z.enum(['GOOGLE', 'FACEBOOK', 'APPLE'])
});

export const updateUserSchema = createLocalUserSchema.partial();

export const isLocalUser = (obj: any): obj is ILocalUser => {
    return obj.authProvider === 'LOCAL';
};
