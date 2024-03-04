import { z } from 'zod';
import { EStockSection } from '@thymecard/types';

export const createStockItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.string().optional(),
    note: z.string().optional(),
    expiryDate: z.string().optional()
});

export const createStockCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    items: z.array(createStockItemSchema)
});

export const upsertStockSchema = z.object({
    section: z.enum([EStockSection.PANTRY, EStockSection.SHOPPING_LIST, EStockSection.FAVORITES]),
    categories: z.array(createStockCategorySchema)
});
