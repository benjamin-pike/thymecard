import { Schema } from 'mongoose';
import { EMealType, IMealEventBookmark, IMealEventBookmarkCreate } from '@thymecard/types';
import { MongoRepository } from '../../../lib/data/mongo.repository';
import { MealEventItemSchema } from '../../day/day.model';

const collectionName = 'MealEventBookmark';

const MealEventBookmarkSchema = new Schema<IMealEventBookmark>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(EMealType),
        required: false,
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
        type: [MealEventItemSchema],
        required: true,
        _id: false
    },
    userId: {
        type: String,
        required: true
    }
});

MealEventBookmarkSchema.index({ _id: 1, userId: 1 });

class MealEventBookmark extends MongoRepository<IMealEventBookmark, IMealEventBookmarkCreate> {
    constructor() {
        super(collectionName, MealEventBookmarkSchema);
    }
}

export const mealEventBookmarkRepository = new MealEventBookmark();
