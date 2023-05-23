import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { OAuth2Client as GoogleAuthClient } from 'google-auth-library';
import { IUser } from '../user/user.types';
import { BadGatewayError, BadRequestError, SironaError, UnauthorizedError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import {
    ITokenPair,
    IAccessTokenPayload,
    IRefreshTokenPayload,
    isRefreshTokenPayload,
    IRefreshTokenEntity,
    IGoogleUser,
    isFacebookUser,
    IFacebookUser,
    isGoogleUser
} from './auth.types';
import { RedisRepository } from '../../lib/database/redis.repository';
import { validateWithError } from '../../lib/types/typeguards.utils';
import { Role, permissions } from '../../lib/auth/permissions';

interface IAuthServiceDependencies {
    redisRepository: RedisRepository;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    googleConfig: IGoogleAuthConfig;
    facebookAuthConfig: IFacebookAuthConfig;
}

interface IGoogleAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
}

interface IFacebookAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    state: string;
}

export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    initializeSession(user: IUser, deviceId: string): Promise<{ accessToken: string; refreshToken: string }>;
    loginUser(user: IUser, password: string, deviceId: string): Promise<ITokenPair>;
    verifyRefreshToken(token: string, deviceId: string): Promise<IRefreshTokenPayload>;
    getGoogleAuthUrl(): Promise<string>;
    getGoogleUserProfile(code: string): Promise<IGoogleUser>;
    getFacebookAuthUrl(): Promise<string>;
    getFacebookUserProfile(code: string, state: string): Promise<IFacebookUser>;
}

export class AuthService {
    private redisRepository: RedisRepository;
    private accessTokenSecret: string;
    private refreshTokenSecret: string;
    private googleAuthClient: GoogleAuthClient;
    private facebookAuthConfig: IFacebookAuthConfig;

    constructor(deps: IAuthServiceDependencies) {
        this.redisRepository = deps.redisRepository;
        this.accessTokenSecret = deps.jwtAccessSecret;
        this.refreshTokenSecret = deps.jwtRefreshSecret;

        this.googleAuthClient = new GoogleAuthClient(
            deps.googleConfig.clientId,
            deps.googleConfig.clientSecret,
            deps.googleConfig.redirectUrl
        );

        this.facebookAuthConfig = deps.facebookAuthConfig;
    }

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private generateAccessToken(user: IUser): string {
        const payload: IAccessTokenPayload = {
            userId: user._id,
            permissions: permissions[Role.USER]
        };
        const expiresIn = '10h';
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn });
    }

    private generateRefreshToken(user: IUser): string {
        const payload: IRefreshTokenPayload = {
            userId: user._id
        };
        const expiresIn = '30d';
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn });
    }

    public async initializeSession(user: IUser, deviceId: string): Promise<{ accessToken: string; refreshToken: string }> {
        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user);

        await this.upsertStoredRefreshToken(user._id, deviceId, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    public async loginUser(user: IUser, password: string, deviceId: string): Promise<ITokenPair> {
        if (!user.password) {
            throw new BadRequestError(ErrorCode.NotLocalUser, 'Please login with the provider you signed up with', {
                origin: 'AuthService.loginUser',
                data: { user }
            });
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError(ErrorCode.InvalidLoginCredentials, 'Invalid email address or password', {
                origin: 'AuthService.loginUser'
            });
        }

        return this.initializeSession(user, deviceId);
    }

    public async verifyRefreshToken(token: string, deviceId: string): Promise<IRefreshTokenPayload> {
        const decodedToken = jwt.verify(token, this.refreshTokenSecret);

        if (!isRefreshTokenPayload(decodedToken)) {
            throw new UnauthorizedError(ErrorCode.InvalidRefreshToken, 'Invalid refresh token', {
                origin: 'AuthService.refreshToken',
                data: { token, decodedToken }
            });
        }

        const storedToken = await this.getStoredRefreshToken(deviceId);
        if (!storedToken || storedToken !== token) {
            throw new UnauthorizedError(ErrorCode.InvalidRefreshToken, 'Invalid refresh token', {
                origin: 'AuthService.refreshToken',
                data: { token, storedToken }
            });
        }

        return decodedToken;
    }

    private async getStoredRefreshToken(deviceId: string): Promise<string | null> {
        const key = `refreshToken::${deviceId}`;
        const tokenObject = await this.redisRepository.get(key);

        if (!tokenObject) {
            return null;
        }

        const { token } = tokenObject;
        return token;
    }

    private async upsertStoredRefreshToken(userId: string, deviceId: string, token: string): Promise<void> {
        const key = `refreshToken::${deviceId}`;
        const value: IRefreshTokenEntity = { key, userId, token };

        await this.redisRepository.set(key, value);
    }

    public async getGoogleAuthUrl(): Promise<string> {
        const scopeRoot = 'https://www.googleapis.com/auth/';
        const scopes = [scopeRoot + 'userinfo.profile', scopeRoot + 'userinfo.email'];
        return this.googleAuthClient.generateAuthUrl({ scope: scopes });
    }

    public async getGoogleUserProfile(code: string): Promise<IGoogleUser> {
        try {
            const { tokens } = await this.googleAuthClient.getToken(code);
            this.googleAuthClient.setCredentials(tokens);

            const { data } = await this.googleAuthClient.request({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
            });

            return validateWithError(
                data,
                isGoogleUser,
                new BadGatewayError(ErrorCode.GoogleAuthError, 'Google returned invalid user data', {
                    origin: 'AuthService.getGoogleUserProfile',
                    data: { data }
                })
            );
        } catch (err) {
            if (err instanceof SironaError) {
                throw err;
            }

            throw new BadGatewayError(ErrorCode.GoogleAuthError, 'An error occured whilst authenticating with Google', {
                origin: 'AuthService.getGoogleUserProfile',
                data: { err }
            });
        }
    }

    public async getFacebookAuthUrl(): Promise<string> {
        const url = new URL('https://www.facebook.com/v12.0/dialog/oauth');
        url.searchParams.append('client_id', this.facebookAuthConfig.clientId);
        url.searchParams.append('redirect_uri', this.facebookAuthConfig.redirectUrl);
        url.searchParams.append('state', this.facebookAuthConfig.state);

        return url.toString();
    }

    public async getFacebookUserProfile(code: string, state: string): Promise<IFacebookUser> {
        try {
            if (state !== this.facebookAuthConfig.state) {
                throw new UnauthorizedError(ErrorCode.FacebookAuthError, 'Facebook returned an invalid state parameter', {
                    origin: 'AuthService.getFacebookUserProfile',
                    data: { state }
                });
            }

            const tokenResponse = await axios.get('https://graph.facebook.com/v16.0/oauth/access_token', {
                params: {
                    client_id: this.facebookAuthConfig.clientId,
                    client_secret: this.facebookAuthConfig.clientSecret,
                    redirect_uri: this.facebookAuthConfig.redirectUrl,
                    code
                }
            });

            const { access_token } = tokenResponse.data;

            const { data } = await axios.get('https://graph.facebook.com/me', {
                params: {
                    fields: 'id,email,first_name,last_name',
                    access_token
                }
            });

            return validateWithError(
                isFacebookUser,
                data,
                new BadGatewayError(ErrorCode.FacebookAuthError, 'Facebook returned invalid user data', {
                    origin: 'AuthService.getFacebookUserProfile',
                    data: { data }
                })
            );
        } catch (err) {
            if (err instanceof SironaError) {
                throw err;
            }

            throw new BadGatewayError(ErrorCode.FacebookAuthError, 'An error occured whilst authenticating with Facebook', {
                origin: 'AuthService.getFacebookUserProfile',
                data: { err }
            });
        }
    }
}
