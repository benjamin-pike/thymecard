import mongoose, { Schema } from 'mongoose';
import { MongoRepository } from '../../lib/data/mongo.repository';
import { IRecipe, IRecipeCreate } from '@thymecard/types';

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

const IngredientMatch = {
    itemId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
};

const Ingredient = {
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Array(Number),
        default: undefined,
        required: false,
    },
    unit: {
        type: String,
        default: undefined,
        required: false
    },
    prepStyles: {
        type: String,
        default: undefined,
        required: false
    },
    notes: {
        type: String,
        default: undefined,
        required: false
    },
    origin: {
        type: String,
        default: undefined,
        required: false
    },
    match: {
        type: IngredientMatch,
        required: false,
        default: null
    }
};

const MethodStep = {
    id: {
        type: String,
        required: true
    },
    stepTitle: {
        type: String,
        required: false
    },
    instructions: {
        type: String,
        required: true
    }
};

const MethodSection = {
    id: {
        type: String,
        required: true
    },
    sectionTitle: {
        type: String,
        required: false
    },
    steps: {
        type: Array(MethodStep),
        required: true,
        _id: false
    },
};

const Comment = {
    userId: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        required: false
    }
};

const RecipeSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: true
        },
        authors: {
            type: Array(String),
            required: false,
            default: undefined
        },
        source: {
            type: String,
            required: false
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
        diet: {
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
            default: undefined
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
        },
        lastCooked: {
            type: Date,
            required: false
        }
    },
    {
        collection: collectionName,
        timestamps: { createdAt: true, updatedAt: true },
        toObject: { versionKey: false, getters: false }
    }
);

RecipeSchema.index({ _id: 1, userId: 1 });

mongoose.model('Recipe', RecipeSchema);

class RecipeRepository extends MongoRepository<IRecipe, IRecipeCreate & { userId: string }> {
    constructor() {
        super(collectionName, RecipeSchema);
    }
}

export const recipeRepository = new RecipeRepository();
