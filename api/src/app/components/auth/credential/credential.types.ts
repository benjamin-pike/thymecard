import { CredentialProvider } from '@thymecard/types';
import { z } from 'zod';

export const createLocalCredentialSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .refine((password) => {
            const hasCapitalLetter = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

            return hasCapitalLetter && hasNumber && hasSpecialCharacter;
        })
});

export const createOAuthCredentialSchema = z.object({
    OAuthId: z.string(),
    email: z.string().email().optional(),
});
