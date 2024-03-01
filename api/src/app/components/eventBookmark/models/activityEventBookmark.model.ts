import { Schema } from 'mongoose';
import { EEventType, IActivityEventBookmark, IActivityEventBookmarkCreate } from '@thymecard/types';
import { MongoRepository } from '../../../lib/data/mongo.repository';
import { ActivityEventItemSchema } from '../../day/day.model';

const collectionName = 'ActivityEventBookmark';

const ActivityEventBookmarkSchema = new Schema<IActivityEventBookmark>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [EEventType.ACTIVITY],
        required: false
    },
    time: {
        type: Number,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    items: {
        type: [ActivityEventItemSchema],
        required: true,
        _id: false
    },
    userId: {
        type: String,
        required: true
    }
});

ActivityEventBookmarkSchema.index({ _id: 1, userId: 1 });

class ActivityEventBookmark extends MongoRepository<IActivityEventBookmark, IActivityEventBookmarkCreate> {
    constructor() {
        super(collectionName, ActivityEventBookmarkSchema);
    }
}

export const activityEventBookmarkRepository = new ActivityEventBookmark();
