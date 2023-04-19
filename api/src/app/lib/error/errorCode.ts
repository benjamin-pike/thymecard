// TODO - order these in a logical manner
export enum ErrorCode {
    MongoDuplicateKey = 1,
    UserNotFound = 2,
    DeletedUserNotFound = 3,
    InvalidUserCreateResource = 3,
    InvalidUserUpdateResource = 4,
    InvalidUserId = 4,
    InvalidContext = 5,
    InvalidQueryParameter = 6,
    InvalidRefreshToken = 7,
    RedisConnectionError = 8,
    MissingLoginCredentials = 9,
    NotLocalUser = 10,
    InvalidAuthProvider = 11,
    GoogleAuthError = 11,
    FacebookAuthError = 12,
    AppleAuthError = 13,
    InternalServerError = 9999
}
