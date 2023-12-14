export interface ICredential {
	_id: string;
	email?: string;
	password?: string;
	OAuthId?: string;
	userId?: string;
	provider: CredentialProvider;
    role: Role;
	verificationCode?: number;
	isVerified: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type ICredentialCreate = Omit<
	ICredential,
	"_id" | "isDeleted" | "createdAt" | "updatedAt"
>;

export interface ISession {
	_id: string;
	userId: string;
	credentialId: string;
	role: Role;
	createdAt: Date;
	updatedAt: Date;
}

export type ISessionCreate = Omit<ISession, "_id" | "createdAt" | "updatedAt">;

export enum CredentialProvider {
	THYMECARD = "THYMECARD",
	GOOGLE = "GOOGLE",
	FACEBOOK = "FACEBOOK"
}

export const isOAuthProvider = (provider: CredentialProvider): provider is OAuthProvider => {
    return provider !== CredentialProvider.THYMECARD;
}

export type OAuthProvider = Exclude<
	CredentialProvider,
	CredentialProvider.THYMECARD
>;

export enum Role {
	ADMIN = "ADMIN",
	USER = "USER"
}
