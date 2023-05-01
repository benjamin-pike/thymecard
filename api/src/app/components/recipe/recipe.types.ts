import { isArrayOf, isOptional, isString, isValidMongoId } from '../../lib/types/types.utils';
import { z } from 'zod';

export interface IRecipe {
    _id: string;
    userId: string;
    source?: string;
    name: string;
    description?: string;
    images?: string[];
    authors?: string[];
    category?: string[];
    cuisine?: string[];
    keywords?: string[];
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    yield: IYield;
    diet?: string[];
    nutrition?: INutritionalInformation;
    ingredients: Ingredients;
    method: Method;
    comments?: IComment[];
    rating?: number;
    isBookmarked?: boolean;
    isPublic?: boolean;
}

export type IRecipeSummary = Pick<
    IRecipe,
    | '_id'
    | 'name'
    | 'category'
    | 'cuisine'
    | 'keywords'
    | 'prepTime'
    | 'cookTime'
    | 'totalTime'
    | 'yield'
    | 'diet'
    | 'rating'
    | 'isBookmarked'
    | 'isPublic'
> & {
    primaryImage: string | null;
    calories?: number;
    ingredientsCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
};

export type IRecipeCreate = Omit<IRecipe, '_id'>;
export type IRecipeUpdate = Partial<IRecipeCreate>;

export type Ingredients = IIngredient[];
export type Method = IMethodSection[];

export interface IIngredient {
    quantity: number[] | null;
    unit: string | null;
    item: string;
    prepStyles?: string[];
    notes?: string[];
    source: string;
}

interface IMethodSection {
    steps: IMethodStep[];
    sectionTitle?: string;
}

interface IMethodStep {
    instructions: string;
    stepTitle?: string;
    image?: string[];
}

export interface IYield {
    quantity: Array<number>;
    units: string | null;
}

export interface INutritionalInformation {
    calories?: number;
    sugar?: number; // g
    carbohydrate?: number; // g
    cholesterol?: number; // mg
    fat?: number; // g
    saturatedFat?: number; // g
    transFat?: number; // g
    unsaturatedFat?: number; // g
    protein?: number; // g
    fiber?: number; // g
    sodium?: number; // mg
    servingSize?: IYield;
}

export interface IComment {
    userId: string;
    comment: string;
    createdAt: Date;
    replyTo?: string;
}

type ICommentCreateResource = Pick<IComment, 'comment' | 'replyTo'>;

export interface IParseRecipeRequestBody {
    url: string;
}

export const isParseRecipeRequestBody = (obj: any): obj is IParseRecipeRequestBody => {
    return obj && isString(obj.url);
};

export const createRecipeSchema = z.object({
    name: z.string(),
    userId: z.string(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
    cuisine: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    prepTime: z.number().optional(),
    cookTime: z.number().optional(),
    totalTime: z.number().optional(),
    yield: z.object({
        quantity: z.array(z.number()),
        units: z.string().nullable()
    }),
    diet: z.array(z.string()).optional(),
    nutrition: z
        .object({
            calories: z.number().optional(),
            sugar: z.number().optional(),
            carbohydrate: z.number().optional(),
            cholesterol: z.number().optional(),
            fat: z.number().optional(),
            saturatedFat: z.number().optional(),
            transFat: z.number().optional(),
            unsaturatedFat: z.number().optional(),
            protein: z.number().optional(),
            fiber: z.number().optional(),
            sodium: z.number().optional(),
            servingSize: z
                .object({
                    quantity: z.array(z.number()),
                    units: z.string().nullable()
                })
                .optional()
        })
        .optional(),
    ingredients: z.array(
        z.object({
            quantity: z.array(z.number()).nullable(),
            unit: z.string().nullable(),
            item: z.string(),
            prepStyles: z.array(z.string()).optional(),
            notes: z.array(z.string()).optional(),
            source: z.string()
        })
    ),
    method: z.array(
        z.object({
            steps: z.array(
                z.object({
                    instructions: z.string(),
                    stepTitle: z.string().optional(),
                    image: z.array(z.string()).optional()
                })
            ),
            sectionTitle: z.string().optional()
        })
    ),
    comments: z
        .array(
            z.object({
                userId: z.string(),
                comment: z.string(),
                createdAt: z.date()
            })
        )
        .optional(),
    rating: z.number().min(0).max(5).optional(),
    isBookmarked: z.boolean().optional(),
    isPublic: z.boolean().optional()
});

export const updateRecipeSchema = createRecipeSchema.omit({ userId: true }).partial();

interface ISchemaOrgHowToStep {
    '@type': 'HowToStep';
    text: string;
    name?: string;
    image?: unknown;
}

interface ISchemaOrgHowToSection {
    '@type': 'HowToSection';
    itemListElement: ISchemaOrgHowToStep[];
    name?: string;
}

export const isSchemaOrgHowToStep = (obj: any): obj is ISchemaOrgHowToStep => {
    return obj && obj['@type'] === 'HowToStep' && isString(obj.text) && isOptional(obj.name, isString);
};

export const isSchemaOrgHowToSection = (obj: any): obj is ISchemaOrgHowToSection => {
    return obj && obj['@type'] === 'HowToSection' && isArrayOf(obj.itemListElement, isSchemaOrgHowToStep) && isOptional(obj.name, isString);
};

export const isCommentCreateResource = (obj: any): obj is ICommentCreateResource => {
    return obj && isString(obj.comment) && isOptional(obj.replyTo, isValidMongoId);
};
