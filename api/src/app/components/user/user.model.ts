import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/database/mongo.repository';
import { ILocalUserCreate, IOAuthUserCreate, IUser } from './user.types';

export const collectionName = 'users';

export const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: false
        },
        dob: {
            type: Date,
            required: false
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE', 'OTHER'],
            required: false
        },
        authProvider: {
            type: String,
            enum: ['LOCAL', 'GOOGLE', 'FACEBOOK', 'APPLE'],
            required: true
        },
        OAuthId: {
            type: String,
            required: false
        },
        deleted: {
            type: Boolean,
            required: false
        }
    },
    {
        collection: collectionName,
        timestamps: { createdAt: true, updatedAt: true },
        toObject: { versionKey: false, getters: false }
    }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index(
    { OAuthId: 1, authProvider: 1 },
    {
        unique: true,
        partialFilterExpression: {
            OAuthId: { $exists: true }
        }
    }
);

mongoose.model('User', UserSchema);

class UserRepository extends MongoRepository<IUser, ILocalUserCreate | IOAuthUserCreate> {
    constructor() {
        super(collectionName, UserSchema);
    }
}

export const userRepository = new UserRepository();
