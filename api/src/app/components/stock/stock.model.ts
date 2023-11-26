import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/data/mongo.repository';
import { IStock } from '@thymecard/types';

export const collectionName = 'stocks';

const StockItem = {
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    expiryDate: {
        type: String,
        required: false
    }
};

const StockCategory = {
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    items: {
        type: [StockItem],
        required: true,
        _id: false
    }
};

export const StockSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        pantry: {
            type: [StockCategory],
            required: true,
            _id: false
        },
        shoppingList: {
            type: [StockCategory],
            required: true,
            _id: false
        },
        favorites: {
            type: [StockCategory],
            required: true,
            _id: false
        }
    },
    {
        collection: collectionName,
        timestamps: { createdAt: true, updatedAt: true },
        toObject: { versionKey: false, getters: false }
    }
);

StockSchema.index({ _id: 1, userId: 1 });

mongoose.model('Stock', StockSchema);

class StockRepository extends MongoRepository<IStock, IStock> {
    constructor() {
        super(collectionName, StockSchema);
    }
}

export const stockRepository = new StockRepository();
