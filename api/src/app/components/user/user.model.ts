import { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/data/mongo.repository';
import { IUser, IUserCreate } from '@thymecard/types';

export const collectionName = 'User';

export const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        image: {
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
        height: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: false
        },
        isPremium: {
            type: Boolean,
            required: false
        }
    }
);

class UserRepository extends MongoRepository<IUser, IUserCreate> {
    constructor() {
        super(collectionName, UserSchema);
    }
}

export const userRepository = new UserRepository();
