import { isString } from '../../lib/types/types.utils';

export interface IRecipe {
    name?: string;
    description?: string;
    images?: string[];
    authors?: string[];
    category?: string[];
    cuisine?: string[];
    keywords?: string[];
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    yield?: IYield;
    diet?: string[];
    nutrition?: INutritionalInformation;
    ingredients?: Ingredients;
    method?: Method;
}

export type Ingredients = IIngredient[];
export type Method = IMethodSection[];

export interface IIngredient {
    quantity: number[] | null;
    unit: string | null;
    item: string;
    prepStyles: string[];
    notes: string[];
    source: string;
}

interface IMethodSection {
    steps: IMethodStep[];
    title?: string;
}

interface IMethodStep {
    instructions: string;
    title?: string;
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

export interface IParseRecipeRequestBody {
    url: string;
}

export const isParseRecipeRequestBody = (obj: any): obj is IParseRecipeRequestBody => {
    return obj && isString(obj.url);
};
