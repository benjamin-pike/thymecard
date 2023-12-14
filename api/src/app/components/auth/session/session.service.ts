import { v4 as uuid } from 'uuid';
import { ErrorCode, ICredential, ISession, Role, isDefined } from '@thymecard/types';
import { sessionRepository } from './session.model';
import { ForbiddenError, NotFoundError } from '../../../lib/error/thymecardError';
import { SessionCache, TokenCache } from '../../../lib/types/cache.types';

interface ISessionServiceDependencies {
    sessionCache: SessionCache;
    tokenCache: TokenCache;
}

export interface ISessionService {
    create(email: string, password: string, role: Role): Promise<ISession>;
    get: (sessionId: string) => Promise<ISession>;
    delete(sessionId: string, userId: string): Promise<void>;
    deleteAll(userId: string): Promise<void>;
    createToken(credentialId: string): string;
    exchangeToken(credential: ICredential, token: string): Promise<ISession>;
}

export class SessionService implements ISessionService {
    private sessionCache: SessionCache;
    private tokenCache: TokenCache;

    constructor(deps: ISessionServiceDependencies) {
        this.sessionCache = deps.sessionCache;
        this.tokenCache = deps.tokenCache;
    }

    public async create(credentialId: string, userId: string, role: Role): Promise<ISession> {
        const session = await sessionRepository.create({ credentialId, userId, role });
        return session;
    }

    public async get(sessionId: string): Promise<ISession> {
        const session = await sessionRepository.getOne({ _id: sessionId });

        if (!session) {
            throw new NotFoundError(ErrorCode.SessionNotFound, 'Session not found', {
                origin: 'SessionService.get',
                data: { sessionId }
            });
        }

        return session;
    }

    public async delete(sessionId: string, userId: string): Promise<void> {
        const isSuccess = await sessionRepository.delete({ _id: sessionId, userId });

        if (!isSuccess) {
            throw new NotFoundError(ErrorCode.SessionNotFound, 'Session not found', {
                origin: 'SessionService.delete',
                data: { sessionId, userId }
            });
        }

        return;
    }

    public async deleteAll(userId: string): Promise<void> {
        const isSuccess = await sessionRepository.delete({ userId });

        if (!isSuccess) {
            throw new NotFoundError(ErrorCode.SessionNotFound, 'No active sessions were found', {
                origin: 'SessionService.delete',
                data: { userId }
            });
        }

        return;
    }

    public createToken(credentialId: string): string {
        const token = uuid();

        this.tokenCache.set(credentialId, token);

        return token;
    }

    public async exchangeToken(credential: ICredential, token: string): Promise<ISession> {
        const storedToken = this.tokenCache.get(credential._id);

        if (storedToken !== token) {
            throw new NotFoundError(ErrorCode.SessionNotFound, 'Invalid exchange token', {
                origin: 'SessionService.exchangeTokenForSession',
                data: { credentialId: credential._id, token }
            });
        }

        if (!isDefined(credential.userId)) {
            throw new ForbiddenError(ErrorCode.UserNotVerified, 'User is not verified', {
                origin: 'SessionService.exchangeTokenForSession',
                data: { credentialId: credential._id }
            });
        }

        this.tokenCache.delete(credential._id);

        const session = this.create(credential._id, credential.userId, credential.role);

        return session;
    }
}
