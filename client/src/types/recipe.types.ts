export interface IRecipe {
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
