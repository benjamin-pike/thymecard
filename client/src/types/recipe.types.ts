import { isArrayOf, isOptional, isString } from "@/lib/type.utils";

export interface IRecipe {
    id: string;
    name: string;
    imageUrl: string;
    servings: number;
    prepTime?: number;
    cookTime?: number;
    rating?: number;
    bookmarked: boolean;
    dateAdded: Date;
    tags: string[];
}

// Stock
export interface IStockCategory {
    id: string;
    name: string;
    items: IStockItem[];
}

export interface IStockItem {
    id: string;
    name: string;
    quantity?: string;
    note?: string;
    expiryDate?: string;
}

export type StockData = Record<StockTab, IStockCategory[]>;
export type StockTab = (typeof stockTabs)[number];

export const stockTabs = ['pantry', 'shopping-list', 'favorites'] as const;

export const isStockData = (obj: any): obj is StockData => {
    return obj &&
        isArrayOf(obj.pantry, isStockCategory) &&
        isArrayOf(obj['shopping-list'], isStockCategory) &&
        isArrayOf(obj.favorites, isStockCategory);
}

const isStockCategory = (obj: any): obj is IStockCategory => {
    return obj &&
        isString(obj.id) &&
        isString(obj.name) &&
        isArrayOf(obj.items, isStockItem);
}

const isStockItem = (obj: any): obj is IStockItem => {
    return obj &&
        isString(obj.id) &&
        isString(obj.name) &&
        isOptional(obj.quantity, isString) &&
        isOptional(obj.note, isString) &&
        isOptional(obj.expiryDate, isString);
}

// Nutrition
export interface IServing {
    quantity: number;
    unit: string;
    weight: number;
}

export interface INutrients {
    energy: number;
    carbohydrates: number;
    sugars: number | null;
    fat: number;
    saturatedFat: number | null;
    cholesterol: number | null;
    protein: number;
    fiber: number | null;
    sodium: number | null;
    potassium: number | null;
    calcium: number | null;
    magnesium: number | null;
    iron: number | null;
    zinc: number | null;
    vitaminA: number | null;
    vitaminB1: number | null;
    vitaminB2: number | null;
    vitaminB3: number | null;
    vitaminB5: number | null;
    vitaminB6: number | null;
    vitaminB9: number | null;
    vitaminB12: number | null;
    vitaminC: number | null;
    vitaminD: number | null;
    vitaminE: number | null;
    vitaminK: number | null;
    caffeine: number | null;
    alcohol: number | null;
}