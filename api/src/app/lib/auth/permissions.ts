export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum Permission {
    READ = 1,
    WRITE = 2,
    DELETE = 4,
    EXECUTE = 8,
    ALL = 15
}

export enum AccessScope {
    User = 'u',
    Recipe = 'r',
    Day = 'd'
}

export const permissions = {
    [Role.ADMIN]: {
        [AccessScope.User]: Permission.ALL,
        [AccessScope.Recipe]: Permission.ALL,
        [AccessScope.Day]: Permission.ALL
    },
    [Role.USER]: {
        [AccessScope.User]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.Recipe]: Permission.READ | Permission.WRITE | Permission.DELETE,
        [AccessScope.Day]: Permission.READ | Permission.WRITE | Permission.DELETE
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