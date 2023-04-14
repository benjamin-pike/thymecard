import { Types } from 'mongoose';
import * as z from 'zod';

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    dob: Date;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    deleted?: boolean;
}

export type IUserCreate = Omit<IUser, '_id' | 'deleted'>;
export type IUserUpdate = Partial<IUserCreate>;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

export const userCreateSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8).regex(passwordRegex),
    phoneNumber: z.string().optional(),
    dob: z.date(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'])
});

export const userUpdateSchema = userCreateSchema.partial();
