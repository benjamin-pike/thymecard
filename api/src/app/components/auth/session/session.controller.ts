import { ErrorCode, ICredential, ISession, IUser, isDefined, isString, isUuid, isValidMongoId } from '@thymecard/types';
import { IAuthenticatedContext, IRequestContext } from '../../../middleware/context.middleware';
import { ISessionService } from './session.service';
import { ICredentialService } from '../credential/credential.service';
import { UnprocessableError } from '../../../lib/error/thymecardError';
import { verifyPassword } from '../../../lib/auth/encryption';
import { IUserService } from '../../user/user.service';
import { IOAuthService } from '../oauth/ouath.service';

interface ISessionControllerDependencies {
    sessionService: ISessionService;
    credentialService: ICredentialService;
    userService: IUserService;
}

export interface ISessionController {
    create(context: IRequestContext, credential: ICredential): Promise<ISession>;
    login(context: IRequestContext, email: unknown, password: unknown): Promise<ISession>;
    logout(context: IRequestContext, sessionId: string): Promise<void>;
    logoutAll(context: IRequestContext): Promise<void>;
    createToken(credentialId: unknown): string;
    exchangeToken(context: IRequestContext, credentialId: unknown, token: unknown): Promise<ISession>;
}

export class SessionController implements ISessionController {
    private sessionService: ISessionService;
    private credentialService: ICredentialService;
    private userService: IUserService;

    constructor(deps: ISessionControllerDependencies) {
        this.sessionService = deps.sessionService;
        this.credentialService = deps.credentialService;
        this.userService = deps.userService;
    }

    public async create(_context: IRequestContext, credential: ICredential): Promise<ISession> {
        if (!credential.userId) {
            throw new UnprocessableError(
                ErrorCode.IncompleteRegistration,
                'Registration is incomplete',
                {
                    origin: 'SessionController.create',
                    data: { credentialId: credential._id }
                },
                {
                    credentialId: credential._id
                }
            );
        }

        if (!credential.isVerified) {
            throw new UnprocessableError(ErrorCode.UserNotVerified, 'Please verify your account before logging in', {
                origin: 'SessionController.login',
                data: { credentialId: credential._id }
            });
        }

        const session = await this.sessionService.create(credential._id, credential.userId, credential.role);

        return session;
    }

    public async login(context: IRequestContext, credential: ICredential, password: unknown): Promise<ISession> {
        if (!isString(password)) {
            throw new UnprocessableError(ErrorCode.InvalidLoginCredentials, 'Invalid login credentials', {
                origin: 'SessionController.login',
                data: { credentialId: credential._id }
            });
        }

        if (!isDefined(credential.password)) {
            throw new UnprocessableError(ErrorCode.NotLocalUser, 'Please login using the method you registered with', {
                origin: 'SessionController.login',
                data: { credentialId: credential._id, provider: credential.provider }
            });
        }

        const isValidPassword = await verifyPassword(password, credential.password);

        if (!isValidPassword) {
            throw new UnprocessableError(ErrorCode.InvalidLoginCredentials, 'Invalid login credentials', {
                origin: 'SessionController.login',
                data: { credentialId: credential._id, exists: true }
            });
        }

        const session = await this.create(context, credential);

        return session;
    }

    public async logout(context: IAuthenticatedContext, sessionId: string): Promise<void> {
        const { userId } = context;

        if (!isValidMongoId(sessionId)) {
            throw new UnprocessableError(ErrorCode.InvalidSessionId, 'Invalid session ID', {
                origin: 'SessionController.logout',
                data: { sessionId, userId }
            });
        }

        await this.sessionService.delete(sessionId, userId);
    }

    public async logoutAll(context: IAuthenticatedContext): Promise<void> {
        const { userId } = context;

        await this.sessionService.deleteAll(userId);
    }

    public createToken(credentialId: unknown): string {
        if (!isValidMongoId(credentialId)) {
            throw new UnprocessableError(ErrorCode.InvalidCredentialId, 'Invalid credential ID', {
                origin: 'SessionController.createToken',
                data: { credentialId }
            });
        }

        const token = this.sessionService.createToken(credentialId);

        return token;
    }

    public async exchangeToken(context: IRequestContext, credentialId: unknown, token: unknown): Promise<ISession> {
        if (!isValidMongoId(credentialId) || !isUuid(token)) {
            throw new UnprocessableError(ErrorCode.InvalidExchangeTokenBody, 'Invalid exchange token request body', {
                origin: 'SessionController.exchangeTokenForSession',
                data: { credentialId, token }
            });
        }

        const credential = await this.credentialService.get(credentialId);

        const session = await this.sessionService.exchangeToken(credential, token);

        return session;
    }
}
