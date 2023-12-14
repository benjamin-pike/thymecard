import { CredentialProvider, ErrorCode, ICredential, Role, isNumber, isString, isValidEmail, isValidMongoId } from '@thymecard/types';
import { IRequestContext } from '../../../middleware/context.middleware';
import { createLocalCredentialSchema, createOAuthCredentialSchema } from './credential.types';
import { ICredentialService } from './credential.service';
import { ForbiddenError, UnprocessableError } from '../../../lib/error/thymecardError';
import { formatZodError } from '../../../lib/error/error.utils';
import { ZodError } from 'zod';

interface ICredentialControllerDependencies {
    credentialService: ICredentialService;
}

export interface ICredentialController {
    create(context: IRequestContext, resource: unknown, provider: CredentialProvider): Promise<ICredential>;
    getByEmail(context: IRequestContext, email: unknown, isLoginRequest?: boolean): Promise<ICredential>;
    findByOAuthId(oauthId: string, provider?: CredentialProvider): Promise<ICredential | null>;
    findByOAuthIdOrEmail(oauthId: string, email: string, provider?: CredentialProvider): Promise<ICredential | null>;
    verify(context: IRequestContext, credentialId: unknown, verificationCode: unknown): Promise<void>;
    linkToUser(context: IRequestContext, credentialId: unknown, userId: string): Promise<ICredential>;
}

export class CredentialController implements ICredentialController {
    private credentialService: ICredentialService;

    constructor(deps: ICredentialControllerDependencies) {
        this.credentialService = deps.credentialService;
    }

    public async create(_context: IRequestContext, resource: unknown, provider: CredentialProvider): Promise<ICredential> {
        try {
            let parsedResource;
            let verificationCode;
            const isVerified = provider !== CredentialProvider.THYMECARD

            if (provider === CredentialProvider.THYMECARD) {
                parsedResource = createLocalCredentialSchema.parse(resource);
                verificationCode = Math.floor(Math.random() * 900000 + 100000);
            } else {
                parsedResource = createOAuthCredentialSchema.parse(resource);
            }

            const payload = {
                ...parsedResource,
                role: Role.USER,
                provider,
                isVerified,
                verificationCode
            };

            return await this.credentialService.create(payload);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidCredentialCreateResource, formatZodError(err), {
                    origin: 'CredentialController.create',
                    data: { resource }
                });
            }
            throw err;
        }
    }

    public async getByEmail(_context: IRequestContext, email: unknown, isLoginRequest = false): Promise<ICredential> {        
        if (!isValidEmail(email)) {
            if (isLoginRequest) {
                throw new UnprocessableError(ErrorCode.InvalidLoginCredentials, 'Invalid login credentials', {
                    origin: 'CredentialController.getByEmail'
                });
            }

            throw new UnprocessableError(ErrorCode.InvalidEmail, 'Invalid email', {
                origin: 'CredentialController.getByEmail',
                data: { email }
            });
        }

        const credential = await this.credentialService.findByEmail(email);

        if (!credential) {
            if (isLoginRequest) {
                throw new UnprocessableError(ErrorCode.InvalidLoginCredentials, 'Invalid login credentials', {
                    origin: 'CredentialController.getByEmail'
                });
            }

            throw new UnprocessableError(ErrorCode.CredentialNotFound, 'Credential not found', {
                origin: 'CredentialController.getByEmail',
                data: { email }
            });
        }

        return credential;
    }

    public async findByOAuthId(oauthId: string, provider?: CredentialProvider): Promise<ICredential | null> {
        return await this.credentialService.findByOAuthId(oauthId, provider);
    }

    public async findByOAuthIdOrEmail(oauthId: string, email: string, provider?: CredentialProvider): Promise<ICredential | null> {
        const credential = await this.credentialService.findByOAuthIdOrEmail(oauthId, email);

        if (provider && credential && credential.provider !== provider) {
            throw new ForbiddenError(ErrorCode.CredentialProviderMismatch, 'Please log in with the provider you signed up with', {
                origin: 'OAuthController.findByOAuthIdOrEmail',
                data: { email: credential.email, OAuthId: credential?.OAuthId, provider: credential.provider }
            }, {
                
            });
        }

        return credential;
    }

    public async verify(_context: IRequestContext, credentialId: unknown, verificationCode: unknown): Promise<void> {
        if (!isValidMongoId(credentialId)) {
            throw new UnprocessableError(ErrorCode.InvalidCredentialId, 'Invalid credential ID', {
                origin: 'CredentialController.verify',
                data: { credentialId }
            });
        }

        if (!isString(verificationCode)) {
            throw new UnprocessableError(ErrorCode.InvalidVerificationCode, 'Invalid verification code', {
                origin: 'CredentialController.verify',
                data: { verificationCode }
            });
        }

        const parsedVerificationCode = parseInt(verificationCode, 10);

        if (!isNumber(parsedVerificationCode)) {
            throw new UnprocessableError(ErrorCode.InvalidVerificationCode, 'Invalid verification code', {
                origin: 'CredentialController.verify',
                data: { verificationCode }
            });
        }

        const credential = await this.credentialService.get(credentialId);

        if (credential.isVerified) {
            throw new UnprocessableError(ErrorCode.InvalidVerificationCode, 'Credential is already verified', {
                origin: 'CredentialController.verify',
                data: { credentialId }
            });
        }

        if (credential.verificationCode !== parsedVerificationCode) {
            throw new UnprocessableError(ErrorCode.InvalidVerificationCode, 'Invalid verification code', {
                origin: 'CredentialController.verify',
                data: { verificationCode }
            });
        }

        await this.credentialService.update(credentialId, { isVerified: true });

        return;
    }

    public async linkToUser(_context: IRequestContext, credentialId: unknown, userId: string): Promise<ICredential> {
        if (!isValidMongoId(credentialId)) {
            throw new UnprocessableError(ErrorCode.InvalidCredentialId, 'Invalid credential ID', {
                origin: 'CredentialController.linkToUser',
                data: { credentialId }
            });
        }

        return await this.credentialService.update(credentialId, { userId });
    }
}
