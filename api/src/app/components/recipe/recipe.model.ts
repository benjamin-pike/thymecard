import mongoose, { Types, Schema } from 'mongoose';
import { IRecipe, IRecipeCreate } from './recipe.types';
import { MongoRepository } from '../../lib/database/mongo.repository';

export const collectionName = 'recipes';

const Yield = {
    quantity: {
        type: [Number],
        required: true
    },
    units: {
        type: String,
        required: false
    }
}

const Ingredient = {
    quantity: {
        type: [Number],
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    item: {
        type: String,
        required: true
    },
    prepStyles: {
        type: [String],
        required: false
    },
    notes: {
        type: [String],
        required: false
    },
    source: {
        type: String,
        required: true
    }
};

const MethodStep = {
    instructions: {
        type: String,
        required: true
    },
    stepTitle: {
        type: String,
        required: false
    },
    image: {
        type: [String],
        required: false
    }
};

const MethodSection = {
    steps: {
        type: [MethodStep],
        _id: false
    },
    sectionTitle: {
        type: String,
        required: false
    }
};

const Recipe = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        images: {
            type: [String],
            required: false
        },
        authors: {
            type: [String],
            required: false
        },
        category: {
            type: [String],
            required: false
        },
        cuisine: {
            type: [String],
            required: false
        },
        keywords: {
            type: [String],
            required: false
        },
        prepTime: {
            type: Number,
            required: false
        },
        cookTime: {
            type: Number,
            required: false
        },
        totalTime: {
            type: Number,
            required: false
        },
        yield: {
            type: Yield,
            required: true,
            _id: false
        },
        diet: {
            type: [String],
            required: false
        },
        nutrition: {
            type: {
                calories: { type: Number, required: false },
                sugar: { type: Number, required: false },
                carbohydrate: { type: Number, required: false },
                cholesterol: { type: Number, required: false },
                fat: { type: Number, required: false },
                saturatedFat: { type: Number, required: false },
                transFat: { type: Number, required: false },
                unsaturatedFat: { type: Number, required: false },
                protein: { type: Number, required: false },
                fiber: { type: Number, required: false },
                sodium: { type: Number, required: false },
                servingSize: Yield
            },
            required: false,
            _id: false
        },
        ingredients: {
            type: [Ingredient],
            required: true,
            _id: false
        },
        method: {
            type: [MethodSection],
            required: true,
            _id: false
        },
        userId: {
            type: Types.ObjectId,
            required: true
        }
    },
    {
        collection: collectionName,
        timestamps: { createdAt: true, updatedAt: true },
        toObject: { versionKey: false, getters: false }
    }
);

Recipe.index({ _id: 1, userId: 1 });

mongoose.model('Recipe', Recipe);

class RecipeRepository extends MongoRepository<IRecipe, IRecipeCreate & { userId: string }> {
    constructor() {
        super(collectionName, Recipe);
    }
}

export const recipeRepository = new RecipeRepository();
