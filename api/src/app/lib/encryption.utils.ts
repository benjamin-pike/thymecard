import pako from 'pako';
import crypto from 'crypto';
import { env } from '../../env';

const ENCRYPTION_KEY = env.AES_ENCRYPTION_KEY;
const IV_LENGTH = 16;

export const compressAndEncrypt = (input: string, useIV: boolean = true): string => {
    const compressed = pako.deflate(input);
    const iv = useIV ? crypto.randomBytes(IV_LENGTH) : Buffer.alloc(IV_LENGTH, 0);
    const cipher = crypto.createCipheriv('aes-256-cbc', crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('hex').slice(0, 32), iv);
    const encrypted = Buffer.concat([cipher.update(Buffer.from(compressed)), cipher.final()]);
    return (useIV ? iv.toString('base64') : '') + encrypted.toString('base64');
};

export const decryptAndDecompress = (input: string, useIV: boolean = true): string => {
    const iv = useIV ? Buffer.from(input.slice(0, (IV_LENGTH * 4) / 3), 'base64') : Buffer.alloc(IV_LENGTH, 0);
    const encrypted = Buffer.from(useIV ? input.slice((IV_LENGTH * 4) / 3) : input, 'base64');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('hex').slice(0, 32),
        iv
    );
    const compressed = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return pako.inflate(compressed, { to: 'string' });
};
