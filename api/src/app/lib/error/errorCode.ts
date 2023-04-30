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
    MissingAccessToken = 8,
    InvalidAccessToken = 9,
    RedisConnectionError = 8,
    MissingLoginCredentials = 9,
    NotLocalUser = 10,
    InvalidAuthProvider = 11,
    GoogleAuthError = 11,
    FacebookAuthError = 12,
    AppleAuthError = 13,
    InsufficientPermissions = 14,
    MissingRoutePermissions = 15,
    RouteNotFound = 16,
    InvalidRecipeParseInput = 17,
    InvalidIngredientParseOutput = 19,
    InvalidRecipeUrl = 20,
    ExternalPageNotFound = 21,
    InvalidRequestReturnType = 22,
    InvalidRecipeCreateResource = 23,
    InvalidRecipeUpdateResource = 24,
    RecipeNotFound = 24,
    InvalidCommentCreateResource = 25,
    InternalServerError = 9999
}
