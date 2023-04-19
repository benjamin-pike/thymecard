import { ObjectId } from 'mongoose';
import * as z from 'zod';

export enum AuthProvider {
    Local = 'LOCAL',
    Google = 'GOOGLE',
    Facebook = 'FACEBOOK',
    Apple = 'APPLE'
}
export interface IUser {
    _id: ObjectId;
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    dob?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    authProvider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE';
    deleted?: boolean;
}

interface ILocalUser extends IUser {
    lastName: string;
    password: string;
    authProvider: 'LOCAL';
}

export type IOAuthUserCreate = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'authProvider'>;
export type ILocalUserCreate = Omit<ILocalUser, '_id' | 'deleted'>;

export type IUserUpdate = Partial<IUser>;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const createLocalUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8).regex(passwordRegex),
    phoneNumber: z.string().optional(),
    dob: z.date().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    authProvider: z.literal('LOCAL')
});

export const createOAuthUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    authProvider: z.enum(['GOOGLE', 'FACEBOOK', 'APPLE'])
});

export const updateUserSchema = createLocalUserSchema.partial();

export const isLocalUser = (obj: any): obj is ILocalUser => {
    return obj.authProvider === 'LOCAL';
};
