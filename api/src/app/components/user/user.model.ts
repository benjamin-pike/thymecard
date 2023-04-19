import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/database/mongo.repository';
import { ILocalUserCreate, IOAuthUserCreate, IUser } from './user.types';

export const collectionName = 'users';

export const User = new Schema(
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
            required: true
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

User.index({ email: 1 }, { unique: true });

mongoose.model('User', User);

class UserRepository extends MongoRepository<IUser, ILocalUserCreate | IOAuthUserCreate> {
    constructor() {
        super(collectionName, User);
    }
}

export const userRepository = new UserRepository();
