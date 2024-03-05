import { isArrayOf, isOptional, isString } from '../../lib/types/typeguards.utils';
import { z } from 'zod';
import { transformDateString } from '../../lib/types/zod.utils';

export const createRecipeSchema = z.object({
    userId: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    authors: z.array(z.string()),
    source: z.string().nullable(),
    category: z.array(z.string()),
    cuisine: z.array(z.string()),
    diet: z.array(z.string()),
    prepTime: z.number().nullable(),
    cookTime: z.number().nullable(),
    totalTime: z.number().nullable(),
    yield: z.object({
        quantity: z.array(z.number()),
        units: z.string().nullable()
    }),
    nutrition: z
        .object({
            calories: z.number().nullable(),
            sugar: z.number().nullable(),
            carbohydrate: z.number().nullable(),
            cholesterol: z.number().nullable(),
            fat: z.number().nullable(),
            saturatedFat: z.number().nullable(),
            transFat: z.number().nullable(),
            unsaturatedFat: z.number().nullable(),
            protein: z.number().nullable(),
            fiber: z.number().nullable(),
            sodium: z.number().nullable(),
            servingSize: z
                .object({
                    quantity: z.array(z.number()),
                    units: z.string().nullable()
                })
                .nullable()
        }),
    ingredients: z.array(
        z.object({
            item: z.string(),
            quantity: z.array(z.number()).nullable(),
            unit: z.string().nullable(),
            prepStyles: z.string().nullable(),
            notes: z.string().nullable(),
            match: z
                .object({
                    itemId: z.number(),
                    name: z.string(),
                })
                .nullable()
        })
    ),
    method: z.array(
        z.object({
            id: z.string(),
            sectionTitle: z.string().nullable(),
            steps: z.array(
                z.object({
                    id: z.string(),
                    instructions: z.string(),
                    stepTitle: z.string().nullable()
                })
            )
        })
    ),
    rating: z.number().min(0).max(5).nullable(),
    lastCooked: transformDateString.nullable(),
    comments: z
        .array(
            z.object({
                userId: z.string(),
                comment: z.string(),
                createdAt: transformDateString
            })
        ),
    isBookmarked: z.boolean(),
    isPublic: z.boolean()
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
