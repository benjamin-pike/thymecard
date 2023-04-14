import * as bcrypt from 'bcrypt';
import { userRepository } from './user.model';
import { IUser, IUserCreate } from './user.types';
import { NotFoundError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { UserCache } from '../../lib/types/cache.types';

interface IUserServiceDependencies {
    userCache: UserCache;
}

export class UserService {
    private cache: UserCache;

    constructor(dependencies: IUserServiceDependencies) {
        this.cache = dependencies.userCache;
    }

    public async createUser(user: IUserCreate): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const createdUser = await userRepository.create({ ...user, password: hashedPassword });

        this.cache.set(createdUser._id.toString(), createdUser);

        return createdUser;
    }

    public async updateUser(userId: string, update: Partial<IUser>): Promise<IUser> {
        const query = { _id: userId, deleted: { $ne: true } };

        const hashedPassword = update.password ? await bcrypt.hash(update.password, 10) : undefined;

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

    public async getUser(userId: string): Promise<IUser> {
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
            throw new NotFoundError(ErrorCode.DeletedUserNotFound, 'The requested account not longer exists', {
                origin: 'UserService.getUser',
                data: { user }
            });
        }

        this.cache.set(userId, user);

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
