import { ZodError } from 'zod';
import { formatZodError } from '../../lib/error/error.utils';
import { ErrorCode } from '../../lib/error/errorCode';
import { NotFoundError, UnprocessableError } from '../../lib/error/sironaError';
import { hasKey, isObject, isString, isValidMongoId } from '../../lib/types/types.utils';
import { UserService } from './user.service';
import {
    AuthProvider,
    ILocalUserCreate,
    IOAuthUserCreate,
    IUser,
    IUserUpdate,
    createLocalUserSchema,
    updateUserSchema
} from './user.types';
import { IFacebookUser, IGoogleUser } from '../auth/auth.types';

interface IUserControllerDependencies {
    userService: UserService;
}

interface IUserController {
    createLocalUser(context: any, resource: unknown): Promise<IUser>;
    getUserById(context: any, userId: string): Promise<IUser>;
    getUserByEmailNoError(context: any, email: string): Promise<IUser | null>;
    updateUser(context: any, userId: string, resource: unknown): Promise<IUser>;
    deleteUser(context: any, userId: string): Promise<void>;
    getOrCreateOAuthUser(context: any, OAuthId: string, email: string | undefined, resource: unknown, authProvider: AuthProvider): Promise<IUser>;
}

export class UserController implements IUserController {
    private userService: UserService;

    constructor(deps: IUserControllerDependencies) {
        this.userService = deps.userService;
    }

    public async createLocalUser(_context: any, resource: unknown) {
        try {
            if (isObject(resource) && hasKey(resource, 'dob') && isString(resource.dob)) {
                resource.dob = new Date(resource.dob);
            }

            const userResource: ILocalUserCreate = createLocalUserSchema.parse(resource);

            return await this.userService.createUser({ ...userResource, authProvider: AuthProvider.Local });
        } catch (err: any) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidUserCreateResource, formatZodError(err), {
                    origin: 'UserController.create',
                    data: { resource }
                });
            }
            throw err;
        }
    }

    public async getUserById(_context: any, userId: string) {
        if (!isValidMongoId(userId)) {
            throw new UnprocessableError(ErrorCode.InvalidUserId, 'Invalid user ID', {
                origin: 'UserController.getById',
                data: { userId }
            });
        }
        return await this.userService.getUserById(userId);
    }

    public async getUserByEmailNoError(_context: any, email: string) {
        try {
            return await this.userService.getUserByEmail(email);
        } catch (err: any) {
            if (err instanceof NotFoundError) {
                return null;
            }

            throw err;
        }
    }

    public async updateUser(_context: any, userId: string, resource: unknown) {
        if (!isValidMongoId(userId)) {
            throw new UnprocessableError(ErrorCode.InvalidUserId, 'Invalid user ID', {
                origin: 'UserController.getById',
                data: { userId }
            });
        }

        try {
            if (isObject(resource) && hasKey(resource, 'dob') && isString(resource.dob)) {
                resource.dob = new Date(resource.dob);
            }

            const userResource: IUserUpdate = updateUserSchema.parse(resource);

            return await this.userService.updateUser(userId, userResource);
        } catch (err: any) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidUserUpdateResource, formatZodError(err), {
                    origin: 'UserController.update',
                    data: { userId, resource }
                });
            }
            throw err;
        }
    }

    public async deleteUser(_context: any, userId: string) {
        if (!isValidMongoId(userId)) {
            throw new UnprocessableError(ErrorCode.InvalidUserId, 'Invalid user ID', {
                origin: 'UserController.getById',
                data: { userId }
            });
        }

        return await this.userService.deleteUser(userId);
    }

    public async getOrCreateOAuthUser(_context: any, OAuthId: string, email: string | undefined, resource: unknown, authProvider: AuthProvider): Promise<IUser> {
        try {
            const existingUser = await this.userService.getOAuthUserOrNull(OAuthId, authProvider, email);

            if (existingUser) {
                if (existingUser.authProvider !== authProvider) {
                    throw new UnprocessableError(ErrorCode.InvalidAuthProvider, 'Please log in with the method you used to sign up', {
                        origin: 'UserController.getOrCreateOAuthUser',
                        data: { email, authProvider }
                    });
                }

                return existingUser;
            }

            let userResource: IOAuthUserCreate;

            switch (authProvider) {
                case AuthProvider.Google:
                    const googleUser = resource as IGoogleUser;
                    userResource = {
                        firstName: googleUser.given_name,
                        lastName: googleUser.family_name,
                        OAuthId: googleUser.id,
                        email: googleUser.email,
                        authProvider
                    };
                    break;
                case AuthProvider.Facebook:
                    const facebookUser = resource as IFacebookUser;
                    userResource = {
                        firstName: facebookUser.first_name,
                        lastName: facebookUser.last_name,
                        OAuthId: facebookUser.id,
                        email: facebookUser.email,
                        authProvider
                    };
                    break;
                default:
                    throw new UnprocessableError(ErrorCode.InvalidAuthProvider, 'Invalid auth provider', {
                        origin: 'UserController.getOrCreateOAuthUser',
                        data: { email, authProvider }
                    });
            }

            return await this.userService.createUser(userResource);
        } catch (err: any) {
            throw err;
        }
    }
}
