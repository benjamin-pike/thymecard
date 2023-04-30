import { userRepository } from './user.model';
import { AuthProvider, ILocalUserCreate, IOAuthUserCreate, IUser, isLocalUser } from './user.types';
import { NotFoundError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { UserCache } from '../../lib/types/cache.types';
import { IAuthService } from '../auth/auth.service';

interface IUserServiceDependencies {
    userCache: UserCache;
    authService: IAuthService;
}

export interface IUserService {
    createUser(user: ILocalUserCreate | IOAuthUserCreate): Promise<IUser>;
    updateUser(userId: string, update: Partial<IUser>): Promise<IUser>;
    getUserById(userId: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser>;
    deleteUser(userId: string): Promise<void>;
}

export class UserService implements IUserService {
    private cache: UserCache;
    private authService: IAuthService;

    constructor(deps: IUserServiceDependencies) {
        this.cache = deps.userCache;
        this.authService = deps.authService;
    }

    public async createUser(user: ILocalUserCreate | IOAuthUserCreate): Promise<IUser> {
        let createdUser: IUser;

        if (isLocalUser(user)) {
            const hashedPassword = await this.authService.hashPassword(user.password);
            createdUser = await userRepository.create({ ...user, password: hashedPassword });
        } else {
            createdUser = await userRepository.create(user);
        }

        this.cache.set(createdUser._id, createdUser);

        return createdUser;
    }

    public async updateUser(userId: string, update: Partial<IUser>): Promise<IUser> {
        const query = { _id: userId, deleted: { $ne: true } };

        const hashedPassword = update.password ? await this.authService.hashPassword(update.password) : undefined;

        const updatedUser = await userRepository.findOneAndUpdate(query, { ...update, password: hashedPassword });

        if (!updatedUser) {
            throw new NotFoundError(ErrorCode.UserNotFound, 'User not found', {
                origin: 'UserService.updateUser',
                data: { userId, update }
            });
        }

        this.cache.set(userId, updatedUser);

        return updatedUser;
    }

    public async getUserById(userId: string): Promise<IUser> {
        const cachedUser = this.cache.get(userId);

        if (cachedUser) {
            return cachedUser;
        }

        const query = { _id: userId };
        const user = await userRepository.getOne(query);

        if (!user) {
            throw new NotFoundError(ErrorCode.UserNotFound, 'User not found', {
                origin: 'UserService.getUser',
                data: { userId }
            });
        }

        if (user.deleted) {
            throw new NotFoundError(ErrorCode.DeletedUserNotFound, 'The requested account no longer exists', {
                origin: 'UserService.getUser',
                data: { user }
            });
        }

        this.cache.set(userId, user);

        return user;
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        const query = { email };
        const user = await userRepository.getOne(query);

        if (!user) {
            throw new NotFoundError(ErrorCode.UserNotFound, 'User not found', {
                origin: 'UserService.getUser',
                data: { email }
            });
        }

        if (user.deleted) {
            throw new NotFoundError(ErrorCode.DeletedUserNotFound, 'The requested account no longer exists', {
                origin: 'UserService.getUser',
                data: { email }
            });
        }

        return user;
    }

    public async getOAuthUserOrNull(OAuthId: string, authProvider: AuthProvider, email: string | undefined): Promise<IUser | null> {
        const query = { $or: [{ OAuthId, authProvider }, { email }] };
        const user = await userRepository.getOne(query);

        if (!user) {
            return null
        }

        if (user.deleted) {
            throw new NotFoundError(ErrorCode.DeletedUserNotFound, 'The requested account no longer exists', {
                origin: 'UserService.getUser',
                data: { OAuthId, authProvider }
            });
        }

        return user;
    }

    public async deleteUser(userId: string): Promise<void> {
        const query = { _id: userId, deleted: { $ne: true } };
        const update = {
            firstName: 'REDACTED',
            lastName: 'REDACTED',
            deleted: true
        };

        const deletedUser = await userRepository.findOneAndUpdate(query, update);

        if (!deletedUser) {
            throw new NotFoundError(ErrorCode.UserNotFound, 'User not found', {
                origin: 'UserService.deleteUser',
                data: { userId }
            });
        }

        this.cache.delete(userId);

        return;
    }
}
