import { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/data/mongo.repository';
import { EEventType, IDay, IDayCreate, IDayEvent, IMealEventItem, IActivityEventItem } from '@thymecard/types';

const collectionName = 'Day';

export const MealEventItemSchema = new Schema<IMealEventItem>({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: false
    },
    recipeId: {
        type: String,
        required: false
    }
});

export const ActivityEventItemSchema = new Schema<IActivityEventItem>({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: false
    },
    activityId: {
        type: String,
        required: false
    }
});

export const DayEventSchema = new Schema<IDayEvent>({
    type: {
        type: String,
        enum: Object.values(EEventType),
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    items: {
        type: [MealEventItemSchema, ActivityEventItemSchema],
        required: true,
        _id: false
    },
    bookmarkId: {
        type: String,
        required: false
    }
});

const DaySchema = new Schema<IDay>({
    date: {
        type: Date,
        required: true
    },
    events: {
        type: [DayEventSchema],
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

DaySchema.index({ _id: 1, userId: 1 });
DaySchema.index({ userId: 1, date: 1 }, { unique: true });

class DayRepository extends MongoRepository<IDay, IDayCreate> {
    constructor() {
        super(collectionName, DaySchema);
    }
}

export const dayRepository = new DayRepository();
