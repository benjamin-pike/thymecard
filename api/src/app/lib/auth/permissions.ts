import { Role } from "@thymecard/types";

export enum Permission {
    READ = 1,
    WRITE = 2,
    DELETE = 4,
    EXECUTE = 8,
    ALL = 15
}

export enum AccessScope {
    AUTH = 'a',
    USER = 'u',
    RECIPE = 'r',
    DAY = 'd',
    PANTRY = 'p',
    STOCK = 's'
}

export const permissions = {
    [Role.ADMIN]: {
        [AccessScope.AUTH]: Permission.ALL,
        [AccessScope.USER]: Permission.ALL,
        [AccessScope.RECIPE]: Permission.ALL,
        [AccessScope.DAY]: Permission.ALL,
        [AccessScope.PANTRY]: Permission.ALL,
        [AccessScope.STOCK]: Permission.ALL
    },
    [Role.USER]: {
        [AccessScope.AUTH]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.USER]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.RECIPE]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.DAY]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.PANTRY]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.STOCK]: Permission.READ | Permission.WRITE | Permission.DELETE
    }
}

export interface IScopedPermission {
    scope: AccessScope;
    permission: Permission;
}

export interface IRoutePermissions {
    [route: string]: IScopedPermission[];
}

export interface IResourcePermissions {
    [resource: string]: IRoutePermissions;
}

export const hasPermissions = (userPermissions: Record<string, number>, requiredPermissions: IScopedPermission[]): boolean => {
    return requiredPermissions.every(({ scope, permission }) => {
        return (userPermissions[scope] & permission) === permission;
    });
}