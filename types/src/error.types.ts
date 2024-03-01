export enum ErrorCode {
	// General errors
	InternalError = 9999,

	// Not found errors (01xx)
	RouteNotFound = 101,
	ExternalPageNotFound = 102,
	UserNotFound = 103,
	DeletedUserNotFound = 104,
	RecipeNotFound = 105,
	DayNotFound = 106,
	PantryProductNotFound = 107,
	CredentialNotFound = 108,
	SessionNotFound = 109,
    DayEventNotFound = 110,

	// Typeguard errors (02xx)
	// Resource errors (0200 - 0249)
	InvalidUserCreateResource = 201,
	InvalidUserUpdateResource = 202,
	InvalidRecipeCreateResource = 203,
	InvalidRecipeUpdateResource = 204,
	InvalidRecipeParseRequestBody = 205,
	InvalidCommentCreateResource = 206,
	InvalidDayCreateResource = 207,
	InvalidDayUpdateResource = 208,
	InvalidMealCreateResource = 209,
	InvalidMealUpdateResource = 210,
	InvalidImageResource = 211,
	InvalidStockUpsertResource = 212,
	InvalidCredentialCreateResource = 213,

	// General type errors (0250 - 0299)
	InvalidDateString = 250,
	InvalidPageStartKey = 251,
	InvalidPageLimit = 252,
    InvalidNextKey = 253,

	// Invalid parameter errors (03xx)
    InvalidParameter = 300,
	InvalidUserId = 301,
	InvalidRecipeId = 302,
	InvalidQueryParameter = 303,
	InvalidIngredientParseOutput = 304,
	InvalidRecipeUrl = 305,
	InvalidRequestReturnType = 306,
	InvalidDayId = 307,
	InvalidEventId = 308,
	InvalidEnrichedFlag = 309,
	InvalidCredentialId = 310,
	InvalidVerificationCode = 311,
	InvalidOAuthId = 312,
	InvalidSessionId = 313,
	InvalidNonce = 314,
	InvalidExchangeTokenBody = 315,
	InvalidEmail = 316,
	InvalidSearchQuery = 317,
    InvalidEventItemId = 318,
    InvalidEventBookmarkRequestBody = 319,
    InvalidEventBookmarkType = 320,


	// Permission/Authentication errors (04xx)
	InvalidLoginCredentials = 401,
	NotLocalUser = 402,
	InvalidAuthProvider = 403,
	GoogleAuthError = 404,
	FacebookAuthError = 405,
	AppleAuthError = 406,
	MissingAccessToken = 407,
	InvalidAccessToken = 408,
	InvalidRefreshToken = 409,
	MissingRoutePermissions = 410,
	InsufficientPermissions = 411,
	InvalidContext = 412,
	TooManyRequests = 413,
	UserNotVerified = 414,
	IncompleteRegistration = 415,
	CredentialProviderMismatch = 416,

	// Database errors (05xx)
	MongoDuplicateKey = 501,
	RedisConnectionError = 502,

	// Conflict errors (06xx)
	UserAlreadyExists = 601,

	// Integration errors (07xx)
	SendgridError = 701,

	// Miscelaneous errors (50xx)
	StockCategoryUpsertFailed = 5001,
	ConflictError
}
