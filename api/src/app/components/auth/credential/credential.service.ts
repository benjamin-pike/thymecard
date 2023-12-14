import sendgrid from '@sendgrid/mail';
import { credentialRepository } from './credential.model';
import { hashPassword } from '../../../lib/auth/encryption';
import { CredentialProvider, ErrorCode, ICredential, ICredentialCreate, isDefined } from '@thymecard/types';
import { BadGatewayError, ConflictError, NotFoundError } from '../../../lib/error/thymecardError';

interface ICredentialServiceDependencies {
    sendgridEmail: string;
}

export interface ICredentialService {
    create(resource: ICredentialCreate): Promise<ICredential>;
    get(credentialId: string): Promise<ICredential>;
    update(credentialId: string, resource: Partial<ICredential>): Promise<ICredential>;
    findByEmail(email: string): Promise<ICredential | null>;
    findByOAuthId(id: string, provider?: CredentialProvider): Promise<ICredential | null>;
    findByOAuthIdOrEmail(id: string, email: string): Promise<ICredential | null>;
}

export class CredentialService implements ICredentialService {
    private sendgridEmail: string;

    constructor(deps: ICredentialServiceDependencies) {
        this.sendgridEmail = deps.sendgridEmail;
    }

    public async create(resource: ICredentialCreate): Promise<ICredential> {
        const { password, ...partialPayload } = resource;
        const hashedPassword = isDefined(password) ? await hashPassword(password) : undefined;
        const payload = { ...partialPayload, password: hashedPassword };

        try {
            const credential = await credentialRepository.create(payload);

            if (credential.provider === CredentialProvider.THYMECARD) {
                const message = {
                    to: credential.email,
                    from: this.sendgridEmail,
                    subject: 'Thymecard Verification Code',
                    text: `Hi, your verification code for Thymecard is ${credential.verificationCode}`,
                    html: `<p>Hi, your verification code for Thymecard is <strong>${credential.verificationCode}</strong><p>`
                };

                try {
                    await sendgrid.send(message);
                } catch (error) {
                    throw new BadGatewayError(ErrorCode.SendgridError, 'Error sending verification email', {
                        origin: 'CredentialService.linkToUser',
                        data: { credentialId: credential._id, error }
                    });
                }
            }

            return credential;
        } catch (err) {
            if (err instanceof ConflictError) {
                throw new ConflictError(ErrorCode.UserAlreadyExists, 'Email is already registered', {
                    origin: 'CredentialService.create',
                    data: { email: resource.email }
                });
            }
            throw err;
        }
    }

    public async get(credentialId: string): Promise<ICredential> {
        const credential = await credentialRepository.getOne({ _id: credentialId });

        if (!credential) {
            throw new NotFoundError(ErrorCode.CredentialNotFound, 'Credential not found', {
                origin: 'CredentialService.get',
                data: { credentialId }
            });
        }

        return credential;
    }

    public async update(credentialId: string, resource: Partial<ICredential>): Promise<ICredential> {
        const credential = await credentialRepository.findOneAndUpdate({ _id: credentialId }, resource);

        if (!credential) {
            throw new NotFoundError(ErrorCode.CredentialNotFound, 'Credential not found', {
                origin: 'CredentialService.update',
                data: { credentialId }
            });
        }

        return credential;
    }

    public async findByEmail(email: string): Promise<ICredential | null> {
        const credential = await credentialRepository.getOne({ email });

        if (!credential) {
            return null;
        }

        return credential;
    }

    public async findByOAuthId(id: string, provider?: string): Promise<ICredential | null> {
        const credential = await credentialRepository.getOne({ provider, OAuthId: id });

        if (!credential) {
            return null;
        }

        return credential;
    }

    public async findByOAuthIdOrEmail(id: string, email: string): Promise<ICredential | null> {
        const credential = await credentialRepository.getOne({
            $or: [{ email }, { OAuthId: id }]
        });

        if (!credential) {
            return null;
        }

        return credential;
    }
}
