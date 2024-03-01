import { ZodError, object } from 'zod';
import { formatZodError } from '../../lib/error/error.utils';
import { UnprocessableError } from '../../lib/error/thymecardError';
import { hasKey, isObject, isString, isValidMongoId } from '../../lib/types/typeguards.utils';
import { IUserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.types';
import { ErrorCode, ICredential, IUser, IUserCreate, IUserUpdate, isDefined, isOptionalString, or } from '@thymecard/types';
import { ICredentialService } from '../auth/credential/credential.service';

interface IUserControllerDependencies {
    userService: IUserService;
    credentialService: ICredentialService;
}

export interface IUserController {
    createUser(context: any, credential: ICredential, resource: unknown, image?: Express.Multer.File): Promise<IUser>;
    getUserById(context: any, userId: string): Promise<IUser>;
    updateUser(context: any, userId: string, resource: unknown): Promise<IUser>;
    deleteUser(context: any, userId: string): Promise<void>;
}

export class UserController implements IUserController {
    private userService: IUserService;

    constructor(deps: IUserControllerDependencies) {
        this.userService = deps.userService;
    }

    public async createUser(_context: any, credential: ICredential, resource: unknown, image?: Express.Multer.File) {
        try {
            if (!isValidMongoId(credential._id)) {
                throw new UnprocessableError(ErrorCode.InvalidUserCreateResource, 'Invalid credential id', {
                    origin: 'UserController.create',
                    data: { credentialId: credential._id }
                });
            }

            if (!credential.isVerified) {
                throw new UnprocessableError(ErrorCode.InvalidUserCreateResource, 'Credential must be verified', {
                    origin: 'UserController.create',
                    data: { credentialId: credential._id }
                });
            }

            if (!isObject(resource) || !hasKey(resource, 'data') || !isString(resource.data)) {
                throw new UnprocessableError(ErrorCode.InvalidUserCreateResource, 'Invalid user create resource', {
                    origin: 'UserController.create',
                    data: { user: isDefined(resource), image: isDefined(image) }
                });
            }

            const parsedResource = JSON.parse(resource.data);

            if (!isObject(parsedResource)) {
                throw new UnprocessableError(ErrorCode.InvalidUserCreateResource, 'Invalid user create resource', {
                    origin: 'UserController.create',
                    data: { parsedResource }
                });
            }

            const userResource: IUserCreate = createUserSchema.parse(parsedResource);

            const user = await this.userService.createUser({ ...userResource }, image);

            return user;
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

    // public async getOrCreateOAuthUser(
    //     _context: any,
    //     OAuthId: string,
    //     email: string | undefined,
    //     resource: unknown,
    //     authProvider: AuthProvider
    // ): Promise<{ user: IUser; isNew: boolean }> {
    //     try {
    //         const existingUser = await this.userService.getOAuthUserOrNull(OAuthId, authProvider, email);

    //         if (existingUser) {
    //             if (existingUser.authProvider !== authProvider) {
    //                 throw new UnprocessableError(ErrorCode.InvalidAuthProvider, 'Please log in with the method you used to sign up', {
    //                     origin: 'UserController.getOrCreateOAuthUser',
    //                     data: { email, authProvider }
    //                 });
    //             }

    //             return { user: existingUser, isNew: false };
    //         }

    //         let userResource: IOAuthUserCreate;

    //         switch (authProvider) {
    //             case AuthProvider.Google:
    //                 const googleUser = resource as IGoogleUser;
    //                 userResource = {
    //                     firstName: googleUser.given_name,
    //                     lastName: googleUser.family_name,
    //                     OAuthId: googleUser.id,
    //                     email: googleUser.email,
    //                     authProvider
    //                 };
    //                 break;
    //             case AuthProvider.Facebook:
    //                 const facebookUser = resource as IFacebookUser;
    //                 userResource = {
    //                     firstName: facebookUser.first_name,
    //                     lastName: facebookUser.last_name,
    //                     OAuthId: facebookUser.id,
    //                     email: facebookUser.email,
    //                     authProvider
    //                 };
    //                 break;
    //             default:
    //                 throw new UnprocessableError(ErrorCode.InvalidAuthProvider, 'Invalid auth provider', {
    //                     origin: 'UserController.getOrCreateOAuthUser',
    //                     data: { email, authProvider }
    //                 });
    //         }

    //         const newUser = await this.userService.createUser(userResource);

    //         return { user: newUser, isNew: true };
    //     } catch (err: any) {
    //         throw err;
    //     }
    // }
}
