import { z } from "zod";
import { isNumber, isValidMongoId } from "../../lib/types/typeguards.utils";

const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'APPETIZER', 'DESSERT', 'DRINK', 'OTHER'] as const;

export interface IMeal {
    _id: string;
    recipeId: string;
    type: (typeof mealTypes)[number];
    time: number;
    servings: number;
}

export interface IMealEnriched extends IMeal {
    primaryImage: string | null;
    name: string | null;
    duration: number | null;
    calories: number | null;
    ingredientsCount: number | null;
}

export interface IDay {
    _id: string;
    userId: string;
    date: Date;
    meals: IMeal[];
    notes?: string[];
}

export type IDayEnriched = Omit<IDay, 'meals'> & {
    meals: IMealEnriched[];
};

export type IMealCreate = Omit<IMeal, '_id'>;
export type IDayCreate = Omit<IDay, '_id' | 'meals'> & { meals: IMealCreate[] };

export type IMealUpdate = Partial<IMealCreate>;
export type IDayUpdate = Partial<IDayCreate>;

export const isMeal = (obj: any): obj is IMeal => {
    return obj && mealTypes.includes(obj.type) && isNumber(obj.time) && isNumber(obj.servings);
};

export const createMealSchema = z.object({
    recipeId: z.string().refine(isValidMongoId, { message: 'Invalid recipe ID' }),
    type: z.enum(mealTypes),
    time: z.number().gte(0).lt(24).step(0.25), // 15 min steps
    servings: z.number()
})

export const createDaySchema = z.object({
    userId: z.string().refine(isValidMongoId, { message: 'Invalid user ID' }),
    date: z.date(),
    meals: z.array(createMealSchema),
    notes: z.array(z.string()).optional()
});

export const updateMealSchema = createMealSchema.partial()
export const updateDaySchema = createDaySchema.partial()