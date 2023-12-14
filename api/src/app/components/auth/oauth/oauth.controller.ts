import { ErrorCode, ICredential, IUser, isString } from '@thymecard/types';
import { IRequestContext } from '../../../middleware/context.middleware';
import { IOAuthService } from './ouath.service';
import { BadGatewayError, ThymecardError, UnprocessableError } from '../../../lib/error/thymecardError';
import { ICredentialService } from '../credential/credential.service';
import { IFacebookUser, IGoogleUser } from './oauth.types';

interface IOAuthControllerDependencies {
    oauthService: IOAuthService;
    credentialService: ICredentialService;
}

export interface IOAuthController {
    getGoogleProfile(context: IRequestContext, code: unknown): Promise<IGoogleUser>;
    getFacebookProfile(context: IRequestContext, code: unknown, state: unknown): Promise<IFacebookUser>;
    buildGoogleAuthUrl(context: IRequestContext): Promise<string>;
    buildFacebookAuthUrl(context: IRequestContext): Promise<string>;
}

export class OAuthController implements IOAuthController {
    private oauthService: IOAuthService;

    constructor(deps: IOAuthControllerDependencies) {
        this.oauthService = deps.oauthService;
    }

    public async getGoogleProfile(_context: IRequestContext, code: unknown): Promise<IGoogleUser> {
        try {
            if (!isString(code)) {
                throw new BadGatewayError(ErrorCode.GoogleAuthError, 'Google did not return a valid response', {
                    origin: 'OAuthController.getGoogleUserProfile',
                    data: { code }
                });
            }

            const profile = await this.oauthService.getGoogleUserProfile(code);

            return profile;
        } catch (err) {
            if (err instanceof ThymecardError) {
                throw err;
            }

            throw new UnprocessableError(ErrorCode.GoogleAuthError, 'Error authenticating with Google', {
                origin: 'OAuthController.getGoogleUserProfile',
                data: { code }
            });
        }
    }

    public async getFacebookProfile(_context: IRequestContext, code: unknown, state: unknown): Promise<IFacebookUser> {
        try {
            if (!isString(code) || !isString(state)) {
                throw new BadGatewayError(ErrorCode.GoogleAuthError, 'Facebook did not return a valid response', {
                    origin: 'OAuthController.getFacebookUserProfile',
                    data: { code }
                });
            }

            const profile = await this.oauthService.getFacebookUserProfile(code, state);

            return profile;
        } catch (err) {
            if (err instanceof ThymecardError) {
                throw err;
            }

            throw new UnprocessableError(ErrorCode.FacebookAuthError, 'Error authenticating with Facebook', {
                origin: 'OAuthController.getFacebookUserProfile',
                data: { code }
            });
        }
    }

    public async buildGoogleAuthUrl(_context: IRequestContext): Promise<string> {
        return await this.oauthService.getGoogleUrl();
    }

    public async buildFacebookAuthUrl(_context: IRequestContext): Promise<string> {
        return await this.oauthService.getFacebookUrl();
    }
}
