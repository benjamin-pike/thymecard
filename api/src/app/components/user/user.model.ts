import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/database/mongo.repository';
import { IUser, IUserCreate } from './user.types';

export const collectionName = 'users';

export const User = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: false
        },
        dob: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE', 'OTHER'],
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

class UserRepository extends MongoRepository<IUser, IUserCreate> {
    constructor() {
        super(collectionName, User);
    }
}

export const userRepository = new UserRepository();
