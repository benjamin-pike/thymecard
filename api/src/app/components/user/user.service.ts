import { v4 as uuid } from 'uuid';
import fileType from 'file-type';
import sharp from 'sharp';
import { S3Repository } from '../../lib/data/s3.repository';
import { userRepository } from './user.model';
import { ErrorCode, IUser, IUserCreate, OAuthProvider } from '@thymecard/types';
import { NotFoundError, UnprocessableError } from '../../lib/error/thymecardError';
import { UserCache } from '../../lib/types/cache.types';

interface IUserServiceDependencies {
    userCache: UserCache;
    s3Repository: S3Repository;
}

export interface IUserService {
    createUser(user: IUserCreate, image?: Express.Multer.File): Promise<IUser>;
    updateUser(userId: string, update: Partial<IUser>): Promise<IUser>;
    getUserById(userId: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser | null>;
    deleteUser(userId: string): Promise<void>;
}

export class UserService implements IUserService {
    private cache: UserCache;
    private s3Repository: S3Repository;

    constructor(deps: IUserServiceDependencies) {
        this.cache = deps.userCache;
        this.s3Repository = deps.s3Repository;
    }

    public async createUser(user: IUserCreate, image?: Express.Multer.File): Promise<IUser> {
        let query = user;

        if (image) {
            const imageFilename = uuid();

            const extension = await fileType.fromBuffer(image.buffer);
            if (!extension) {
                throw new UnprocessableError(ErrorCode.InvalidImageResource, 'The provided profile image is invalid', {
                    origin: 'UserService.createUser'
                });
            }
    
            let imageBuffer = image.buffer;
            if (extension.ext !== 'jpg') {
                imageBuffer = await sharp(image.buffer).jpeg().toBuffer();
            }
    
            await this.s3Repository.uploadFile(imageBuffer, imageFilename, 'jpg', 'images/users');

            query = { ...user, image: imageFilename };
        }

        const createdUser = await userRepository.create(query);

        this.cache.set(createdUser._id, createdUser);

        return createdUser;
    }

    public async updateUser(userId: string, update: Partial<IUser>): Promise<IUser> {
        const query = { _id: userId, isDeleted: { $ne: true } };

        const updatedUser = await userRepository.findOneAndUpdate(query, update);

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

        if (user.isDeleted) {
            throw new NotFoundError(ErrorCode.DeletedUserNotFound, 'The requested account no longer exists', {
                origin: 'UserService.getUser',
                data: { user }
            });
        }

        this.cache.set(userId, user);

        return user;
    }

    public async getUserByEmail(email: string): Promise<IUser | null> {
        const query = { email };
        const user = await userRepository.getOne(query);

        if (!user || user.isDeleted) {
            return null;
        }

        return user;
    }

    public async getOAuthUserOrNull(OAuthId: string, authProvider: OAuthProvider, email: string | undefined): Promise<IUser | null> {
        const query = { $or: [{ OAuthId, authProvider }, { email }] };
        const user = await userRepository.getOne(query);

        if (!user) {
            return null;
        }

        if (user.isDeleted) {
            throw new NotFoundError(ErrorCode.DeletedUserNotFound, 'The requested account no longer exists', {
                origin: 'UserService.getUser',
                data: { OAuthId, authProvider }
            });
        }

        return user;
    }

    public async deleteUser(userId: string): Promise<void> {
        const query = { _id: userId, isDeleted: { $ne: true } };
        const update = {
            firstName: 'REDACTED',
            lastName: 'REDACTED',
            isDeleted: true
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
