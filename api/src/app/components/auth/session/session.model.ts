import { Schema } from 'mongoose';
import { MongoRepository } from '../../../lib/data/mongo.repository';
import { ISession, ISessionCreate, Role } from '@thymecard/types';

export const collectionName = 'Session';

export const SessionSchema = new Schema({
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
});

class SessionRepository extends MongoRepository<ISession, ISessionCreate> {
    constructor() {
        super(collectionName, SessionSchema);
    }
}

export const sessionRepository = new SessionRepository();
