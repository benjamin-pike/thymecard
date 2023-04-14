import { ZodError } from 'zod';
import { formatZodError } from '../../lib/error/error.utils';
import { ErrorCode } from '../../lib/error/errorCode';
import { UnprocessableError } from '../../lib/error/sironaError';
import { hasKey, isObject, isString, isValidMongoId } from '../../lib/types/types.utils';
import { UserService } from './user.service';
import { IUserCreate, IUserUpdate, userCreateSchema, userUpdateSchema } from './user.types';

export class UserController {
    constructor(private userService: UserService) {}

    public async create(_context: any, resource: unknown) {
        try {
            if (isObject(resource) && hasKey(resource, 'dob') && isString(resource.dob)) {
                resource.dob = new Date(resource.dob);
            }

            const userResource: IUserCreate = userCreateSchema.parse(resource);

            return await this.userService.createUser(userResource);
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

    public async getById(_context: any, userId: string) {
        if (!isValidMongoId(userId)) {
            throw new UnprocessableError(ErrorCode.InvalidUserId, 'Invalid user id', {
                origin: 'UserController.getById',
                data: { userId }
            });
        }
        return await this.userService.getUser(userId);
    }

    public async update(_context: any, userId: string, resource: unknown) {
        if (!isValidMongoId(userId)) {
            throw new UnprocessableError(ErrorCode.InvalidUserId, 'Invalid user id', {
                origin: 'UserController.getById',
                data: { userId }
            });
        }

        try {
            if (isObject(resource) && hasKey(resource, 'dob') && isString(resource.dob)) {
                resource.dob = new Date(resource.dob);
            }

            const userResource: IUserUpdate = userUpdateSchema.parse(resource);

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

    public async delete(_context: any, userId: string) {
        if (!isValidMongoId(userId)) {
            throw new UnprocessableError(ErrorCode.InvalidUserId, 'Invalid user id', {
                origin: 'UserController.getById',
                data: { userId }
            });
        }

        return await this.userService.deleteUser(userId);
    }
}
