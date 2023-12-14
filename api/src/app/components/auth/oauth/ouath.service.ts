import { OAuth2Client as GoogleAuthClient } from 'google-auth-library';
import { ErrorCode, validate } from '@thymecard/types';
import { BadGatewayError, ThymecardError, UnauthorizedError } from '../../../lib/error/thymecardError';
import axios from 'axios';
import { IFacebookUser, IGoogleUser, isFacebookUser, isGoogleUser } from './oauth.types';
import { LRUCache } from 'lru-cache';
import { OAuthNonceCache } from '../../../lib/types/cache.types';

interface IOAuthServiceDependencies {
    oauthNonceCache: OAuthNonceCache;
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

export interface IOAuthService {
    getGoogleUserProfile(code: string): Promise<IGoogleUser>;
    getFacebookUserProfile(code: string, state: string): Promise<IFacebookUser>;
    getGoogleUrl(): Promise<string>;
    getFacebookUrl(): Promise<string>;
    setNonce(nonce: string, credentialId: string): Promise<void>;
    validateNonce(nonce: string): string;
}

export class OAuthService implements IOAuthService {
    private oauthNonceCache: OAuthNonceCache;
    private googleAuthClient: GoogleAuthClient;
    private facebookAuthConfig: IFacebookAuthConfig;

    constructor(deps: IOAuthServiceDependencies) {
        this.oauthNonceCache = new LRUCache({
            max: 100,
            ttl: 5 * 60 * 1000 // 5 minutes
        });
        this.googleAuthClient = new GoogleAuthClient(
            deps.googleConfig.clientId,
            deps.googleConfig.clientSecret,
            deps.googleConfig.redirectUrl
        );

        this.facebookAuthConfig = deps.facebookAuthConfig;
    }

    public async getGoogleUserProfile(code: string): Promise<IGoogleUser> {
        try {
            const { tokens } = await this.googleAuthClient.getToken(code);
            this.googleAuthClient.setCredentials(tokens);

            const { data } = await this.googleAuthClient.request({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
            });

            return validate(
                data,
                isGoogleUser,
                new BadGatewayError(ErrorCode.GoogleAuthError, 'Google returned invalid user data', {
                    origin: 'OAuthService.getGoogleUserProfile',
                    data: { data }
                })
            );
        } catch (err) {
            if (err instanceof ThymecardError) {
                throw err;
            }

            throw new BadGatewayError(ErrorCode.GoogleAuthError, 'An error occured whilst authenticating with Google', {
                origin: 'OAuthService.getGoogleUserProfile',
                data: { err }
            });
        }
    }

    public async getFacebookUserProfile(code: string, state: string): Promise<IFacebookUser> {
        try {
            if (state !== this.facebookAuthConfig.state) {
                throw new UnauthorizedError(ErrorCode.FacebookAuthError, 'Facebook returned an invalid state parameter', {
                    origin: 'OAuthService.getFacebookUserProfile',
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

            return validate(
                isFacebookUser,
                data,
                new BadGatewayError(ErrorCode.FacebookAuthError, 'Facebook returned invalid user data', {
                    origin: 'OAuthService.getFacebookUserProfile',
                    data: { data }
                })
            );
        } catch (err) {
            if (err instanceof ThymecardError) {
                throw err;
            }

            throw new BadGatewayError(ErrorCode.FacebookAuthError, 'An error occured whilst authenticating with Facebook', {
                origin: 'OAuthService.getFacebookUserProfile',
                data: { err }
            });
        }
    }

    public async getGoogleUrl(): Promise<string> {
        const scopeRoot = 'https://www.googleapis.com/auth/';
        const scopes = [scopeRoot + 'userinfo.profile', scopeRoot + 'userinfo.email'];
        return this.googleAuthClient.generateAuthUrl({ scope: scopes });
    }

    public async getFacebookUrl(): Promise<string> {
        const url = new URL('https://www.facebook.com/v12.0/dialog/oauth');
        url.searchParams.append('client_id', this.facebookAuthConfig.clientId);
        url.searchParams.append('redirect_uri', this.facebookAuthConfig.redirectUrl);
        url.searchParams.append('state', this.facebookAuthConfig.state);

        return url.toString();
    }

    public async setNonce(nonce: string, credentialId: string): Promise<void> {
        this.oauthNonceCache.set(nonce, credentialId);
    }

    public validateNonce(nonce: string): string {
        const credentialId = this.oauthNonceCache.get(nonce);

        if (!credentialId) {
            throw new UnauthorizedError(ErrorCode.InvalidNonce, 'Invalid nonce', {
                origin: 'OAuthService.validateNonce',
                data: { nonce }
            });
        }

        return credentialId;
    }
}
