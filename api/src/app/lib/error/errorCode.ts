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
    InternalServerError = 9999
}
