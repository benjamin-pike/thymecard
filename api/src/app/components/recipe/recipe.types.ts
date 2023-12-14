import { isArrayOf, isOptional, isString } from '../../lib/types/typeguards.utils';
import { z } from 'zod';
import { transformDateString } from '../../lib/types/zod.utils';

export const createRecipeSchema = z.object({
    userId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    authors: z.array(z.string()).optional(),
    source: z.string().optional(),
    category: z.array(z.string()).optional(),
    cuisine: z.array(z.string()).optional(),
    diet: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    prepTime: z.number().optional(),
    cookTime: z.number().optional(),
    totalTime: z.number().optional(),
    yield: z.object({
        quantity: z.array(z.number()),
        units: z.string().nullable()
    }),
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
            item: z.string(),
            quantity: z.array(z.number()).optional(),
            unit: z.string().optional(),
            prepStyles: z.string().optional(),
            notes: z.string().optional(),
            origin: z.string().optional(),
            match: z
                .object({
                    itemId: z.number(),
                    name: z.string(),
                })
                .nullable()
                .optional(),
        })
    ),
    method: z.array(
        z.object({
            id: z.string(),
            sectionTitle: z.string().optional(),
            steps: z.array(
                z.object({
                    id: z.string(),
                    instructions: z.string(),
                    stepTitle: z.string().optional()
                })
            )
        })
    ),
    rating: z.number().min(0).max(5).optional(),
    lastCooked: transformDateString.optional(),
    comments: z
        .array(
            z.object({
                userId: z.string(),
                comment: z.string(),
                createdAt: transformDateString
            })
        )
        .optional(),
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
