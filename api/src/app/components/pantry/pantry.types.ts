export interface IPantryProduct {
    barcode: string;
    name: string;
    language: string;
    categories: string[] | null;
    tags: string[] | null;
    brands: string[] | null;
    serving: number | null;
    energy: number;
    carbohydrates: number | null;
    sugars: number | null;
    fat: number | null;
    saturatedFat: number | null;
    proteins: number | null;
    fiber: number | null;
    salt: number | null;
}

export type IPantryProductResource = Omit<IPantryProduct, 'categories' | 'tags' | 'brands'> & {
    categories: string | null;
    tags: string | null;
    brands: string | null;
}