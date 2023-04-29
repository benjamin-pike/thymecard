import { AuthService } from './auth.service';
import { IRequestContext } from '../../middleware/context.middleware';
import { UserService } from '../user/user.service';
import { ITokenPair, IGoogleUser, IFacebookUser } from './auth.types';
import { isString } from '../../lib/types/types.utils';
import { SironaError, UnprocessableError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { IUser } from '../user/user.types';

interface IAuthControllerDependencies {
    authService: AuthService;
    userService: UserService;
}

interface IAuthController {
    validatePasswordAndLogin(context: IRequestContext, email: unknown, password: unknown): Promise<{ user: IUser; tokens: ITokenPair }>;
    loginPrevalidatedUser(context: IRequestContext, user: IUser): Promise<ITokenPair>;
    refreshAccessToken(context: IRequestContext, refreshToken: unknown): Promise<ITokenPair>;
    getGoogleAuthUrl(context: IRequestContext): Promise<string>;
    getGoogleUserProfile(context: IRequestContext, code: unknown): Promise<IGoogleUser>;
}

export class AuthController implements IAuthController {
    private authService: AuthService;
    private userService: UserService;

    constructor(deps: IAuthControllerDependencies) {
        this.authService = deps.authService;
        this.userService = deps.userService;
    }

    public async validatePasswordAndLogin(
        context: IRequestContext,
        email: unknown,
        password: unknown
    ): Promise<{ user: IUser; tokens: ITokenPair }> {
        if (!isString(email) || !isString(password)) {
            throw new UnprocessableError(ErrorCode.MissingLoginCredentials, 'An email and password are required to login', {
                origin: 'authRouter.login',
                data: { email, password }
            });
        }

        const user = await this.userService.getUserByEmail(email);
        const tokens = await this.authService.loginUser(user, password, context.deviceId);
        return { user, tokens };
    }

    public async loginPrevalidatedUser(context: IRequestContext, user: IUser): Promise<ITokenPair> {
        return await this.authService.initializeSession(user, context.deviceId);
    }

    public async refreshAccessToken(context: IRequestContext, refreshToken: unknown): Promise<ITokenPair> {
        if (!isString(refreshToken)) {
            throw new UnprocessableError(ErrorCode.InvalidRefreshToken, 'Invalid refresh token', {
                origin: 'authRouter.refreshAccessToken',
                data: { refreshToken }
            });
        }

        const decodedRefreshToken = await this.authService.verifyRefreshToken(refreshToken, context.deviceId);
        const user = await this.userService.getUserById(decodedRefreshToken.userId.toString());
        return await this.authService.initializeSession(user, context.deviceId);
    }

    public async getGoogleAuthUrl(_context: IRequestContext): Promise<string> {
        return await this.authService.getGoogleAuthUrl();
    }

    public async getGoogleUserProfile(_context: IRequestContext, code: unknown): Promise<IGoogleUser> {
        try {
            if (!isString(code)) {
                throw new Error();
            }

            return await this.authService.getGoogleUserProfile(code);
        } catch (err) {
            if (err instanceof SironaError) {
                throw err;
            }

            throw new UnprocessableError(ErrorCode.GoogleAuthError, 'Error authenticating with Google', {
                origin: 'authRouter.loginWithGoogle',
                data: { code }
            });
        }
    };

    public async getFacebookAuthUrl(_context: IRequestContext): Promise<string> {
        return await this.authService.getFacebookAuthUrl();
    };

    public async getFacebookUserProfile(_context: IRequestContext, code: unknown, state: unknown): Promise<IFacebookUser> {
        try {
            if (!isString(code) || !isString(state)) {
                throw new Error();
            }

            return await this.authService.getFacebookUserProfile(code, state);
        } catch (err) {
            throw new UnprocessableError(ErrorCode.FacebookAuthError, 'Error authenticating with Facebook', {
                origin: 'authRouter.loginWithFacebook',
                data: { code }
            });
        }
    }
}
