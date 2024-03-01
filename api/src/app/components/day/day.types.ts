import { z } from 'zod';
import { EEventType } from '@thymecard/types';

const createMealEventItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    servings: z.number(),
    calories: z.number().optional(),
    recipeId: z.string().optional()
});

export const createActivityEventItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    calories: z.number().optional(),
    duration: z.number().optional(),
    activityId: z.string().optional()
});

export const createEventItemSchema = z.union([createMealEventItemSchema, createActivityEventItemSchema]);

export const createEventSchema = z.object({
    type: z.nativeEnum(EEventType),
    time: z.number(),
    duration: z.number(),
    items: z.array(createEventItemSchema),
    bookmarkId: z.string().optional()
});

export const createDaySchema = z.object({
    date: z.date(),
    events: z.array(createEventSchema),
    userId: z.string()
});

const updateMealEventItemSchema = createMealEventItemSchema.partial();
const updateActivityEventItemSchema = createActivityEventItemSchema.partial();
export const updateEventItemSchema = z.union([updateMealEventItemSchema, updateActivityEventItemSchema]);
export const updateEventSchema = createEventSchema.partial();
export const updateDaySchema = createDaySchema.omit({ date: true }).partial();