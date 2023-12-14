import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../../lib/data/mongo.repository';
import { ICredential, ICredentialCreate } from '@thymecard/types';

export const collectionName = 'credentials';

export const CredentialSchema = new Schema(
    {
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        OAuthId: {
            type: String,
            required: false
        },
        provider: {
            type: String,
            enum: ['THYMECARD', 'GOOGLE', 'FACEBOOK', 'APPLE'],
            required: true
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER'],
            required: true
        },
        userId: {
            type: String,
            required: false
        },
        isVerified: {
            type: Boolean,
            required: true
        },
        verificationCode: {
            type: Number,
            required: false
        },
        isDeleted: {
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

CredentialSchema.index({ email: 1 }, { unique: true });
CredentialSchema.index(
    { OAuthId: 1, provider: 1 },
    {
        unique: true,
        partialFilterExpression: {
            OAuthId: { $exists: true }
        }
    }
);

mongoose.model('Credential', CredentialSchema);

class CredentialRepository extends MongoRepository<ICredential, ICredentialCreate> {
    constructor() {
        super(collectionName, CredentialSchema);
    }
}

export const credentialRepository = new CredentialRepository();
