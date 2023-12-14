import * as z from 'zod';

export const transformDateString = z
    .string()
    .refine(
        (value) => {
            return !isNaN(Date.parse(value));
        },
        {
            message: 'Invalid ISO date string'
        }
    )
    .transform((data) => new Date(data));
