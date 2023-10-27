import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/data/mongo.repository';
import { IDay, IDayCreate } from './day.types';

const collectionName = 'days';

const MealSchema = new Schema({
    type: {
        type: String,
        enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'APPETIZER', 'DESSERT', 'DRINK', 'OTHER'],
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    servings: {
        type: Number,
        required: true
    }
});

const DaySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        meals: {
            type: Array(MealSchema),
            required: true
        },
        notes: {
            type: Array(String),
            required: false,
            default: undefined
        }
    },
    {
        collection: collectionName,
        timestamps: { createdAt: true, updatedAt: true },
        toObject: { versionKey: false, getters: false }
    }
);

DaySchema.index({ _id: 1, userId: 1 });
DaySchema.index({ userId: 1, date: 1 }, { unique: true });

mongoose.model('Day', DaySchema);

class DayRepository extends MongoRepository<IDay, IDayCreate & { userId: string }> {
    constructor() {
        super(collectionName, DaySchema);
    }
}

export const dayRepository = new DayRepository();
