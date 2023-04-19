import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../user/user.types';
import { BadGatewayError, BadRequestError, UnauthorizedError } from '../../lib/error/sironaError';
import { ErrorCode } from '../../lib/error/errorCode';
import { ITokenPair, isRefreshTokenPayload, IRefreshTokenPayload, IRefreshTokenEntity, IGoogleUser } from './auth.types';
import { RedisRepository } from '../../lib/database/redis.repository';
import { OAuth2Client as GoogleAuthClient } from 'google-auth-library';

interface IAuthServiceDependencies {
    redisRepository: RedisRepository;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    googleConfig: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
    };
}

export class AuthService {
    private redisRepository: RedisRepository;
    private accessTokenSecret: string;
    private refreshTokenSecret: string;
    private googleAuthClient: GoogleAuthClient;

    constructor(deps: IAuthServiceDependencies) {
        this.redisRepository = deps.redisRepository;
        this.accessTokenSecret = deps.jwtAccessSecret;
        this.refreshTokenSecret = deps.jwtRefreshSecret;

        this.googleAuthClient = new GoogleAuthClient(
            deps.googleConfig.clientId,
            deps.googleConfig.clientSecret,
            deps.googleConfig.redirectUrl
        );
    }

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private generateAccessToken(user: IUser): string {
        const payload = {
            userId: user._id,
            email: user.email
        };
        const expiresIn = '15m';
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn });
    }

    private generateRefreshToken(user: IUser): string {
        const payload = {
            userId: user._id,
            email: user.email
        };
        const expiresIn = '30d';
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn });
    }

    public async initializeSession(user: IUser, deviceId: string): Promise<{ accessToken: string; refreshToken: string }> {
        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user);

        await this.upsertStoredRefreshToken(user._id.toString(), deviceId, newRefreshToken);

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
            throw new Error('Invalid password');
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

    async getStoredRefreshToken(deviceId: string): Promise<string | null> {
        const key = `refreshToken::${deviceId}`;
        const tokenObject = await this.redisRepository.get(key);

        if (!tokenObject) {
            return null;
        }

        const { token } = tokenObject;
        return token;
    }

    async upsertStoredRefreshToken(userId: string, deviceId: string, token: string): Promise<void> {
        const key = `refreshToken::${deviceId}`;
        const value: IRefreshTokenEntity = { key, userId, token };

        await this.redisRepository.set(key, value);
    }

    async getGoogleAuthUrl(): Promise<string> {
        const scopeRoot = 'https://www.googleapis.com/auth/';
        const scopes = [scopeRoot + 'userinfo.profile', scopeRoot + 'userinfo.email'];
        return this.googleAuthClient.generateAuthUrl({ scope: scopes });
    }

    public async getGoogleUserProfile(code: string) {
        try {
            const { tokens } = await this.googleAuthClient.getToken(code);
            this.googleAuthClient.setCredentials(tokens);

            const profileRequest = await this.googleAuthClient.request<IGoogleUser>({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
            });

            return profileRequest.data;
        } catch (err) {
            throw new BadGatewayError(ErrorCode.GoogleAuthError, 'An error occured whilst authenticating with Google', {
                origin: 'AuthService.getGoogleUserProfile',
                data: { err }
            });
        }
    }
}
