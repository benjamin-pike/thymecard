export interface IUser {
	_id: string;
	firstName: string;
	lastName: string;
	image?: string;
	dob: Date;
	gender: UserGender;
	height: number;
	weight: number;
	isDeleted?: boolean;
	isPremium?: boolean;
}

export type IUserCreate = Omit<IUser, "_id" | "isDeleted" | "isPremium">;
export type IUserUpdate = Partial<IUserCreate>;

export enum UserGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}