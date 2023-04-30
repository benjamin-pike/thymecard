import mongoose, { Types, Schema } from 'mongoose';
import { IRecipe, IRecipeCreate } from './recipe.types';
import { MongoRepository } from '../../lib/database/mongo.repository';

export const collectionName = 'recipes';

const Yield = {
    quantity: {
        type: Array(Number),
        required: true
    },
    units: {
        type: String,
        required: false
    }
};

const Nutrition = {
    calories: {
        type: Number,
        required: false
    },
    sugar: {
        type: Number,
        required: false
    },
    carbohydrate: {
        type: Number,
        required: false
    },
    cholesterol: {
        type: Number,
        required: false
    },
    fat: {
        type: Number,
        required: false
    },
    saturatedFat: {
        type: Number,
        required: false
    },
    transFat: {
        type: Number,
        required: false
    },
    unsaturatedFat: {
        type: Number,
        required: false
    },
    protein: {
        type: Number,
        required: false
    },
    fiber: {
        type: Number,
        required: false
    },
    sodium: {
        type: Number,
        required: false
    },
    servingSize: Yield
};

const Ingredient = {
    quantity: {
        type: Array(Number),
        required: false,
        default: null
    },
    unit: {
        type: String,
        required: false,
        default: null
    },
    item: {
        type: String,
        required: true
    },
    prepStyles: {
        type: Array(String),
        default: undefined,
        required: false
    },
    notes: {
        type: Array(String),
        default: undefined,
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
        type: Array(String),
        default: undefined,
        required: false
    }
};

const MethodSection = {
    steps: {
        type: Array(MethodStep),
        required: true,
        _id: false
    },
    sectionTitle: {
        type: String,
        required: false
    }
};

const Comment = {
    userId: {
        type: Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    replyTo: {
        type: Types.ObjectId,
        required: false
    }
}

const Recipe = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Types.ObjectId,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        images: {
            type: Array(String),
            required: false,
            default: undefined
        },
        authors: {
            type: Array(String),
            required: false,
            default: undefined
        },
        category: {
            type: Array(String),
            required: false,
            default: undefined
        },
        cuisine: {
            type: Array(String),
            required: false,
            default: undefined
        },
        keywords: {
            type: Array(String),
            required: false,
            default: undefined
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
            type: Array(String),
            required: false,
            default: undefined
        },
        nutrition: {
            type: Nutrition,
            required: false,
            _id: false
        },
        ingredients: {
            type: Array(Ingredient),
            required: true,
            _id: false
        },
        method: {
            type: Array(MethodSection),
            required: true,
            _id: false
        },
        rating: {
            type: Number,
            required: false,
            min: 0,
            max: 5
        },
        comments: {
            type: Array(Comment),
            required: false,
            default: undefined,
        },
        isBookmarked: {
            type: Boolean,
            required: true,
            default: false
        },
        isPublic: {
            type: Boolean,
            required: true,
            default: false
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
