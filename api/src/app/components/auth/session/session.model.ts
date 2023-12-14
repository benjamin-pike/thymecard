import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../../lib/data/mongo.repository';
import { ISession, ISessionCreate, Role } from '@thymecard/types';

export const collectionName = 'sessions';

export const SessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        credentialId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        role: {
            type: String,
            enum: [Role.USER, Role.ADMIN],
            required: true
        }
    },
    {
        collection: collectionName,
        timestamps: { createdAt: true, updatedAt: true },
        toObject: { versionKey: false, getters: false }
    }
);

mongoose.model('Session', SessionSchema);

class SessionRepository extends MongoRepository<ISession, ISessionCreate> {
    constructor() {
        super(collectionName, SessionSchema);
    }
}

export const sessionRepository = new SessionRepository();
