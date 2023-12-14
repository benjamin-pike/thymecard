import * as z from 'zod';
import { transformDateString } from '../../lib/types/zod.utils';
import { UserGender } from '@thymecard/types';

export const createUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    image: z.string().optional(),
    dob: transformDateString,
    gender: z.enum([UserGender.MALE, UserGender.FEMALE, UserGender.OTHER]),
    height: z.number(),
    weight: z.number(),

});

export const updateUserSchema = createUserSchema.partial();
