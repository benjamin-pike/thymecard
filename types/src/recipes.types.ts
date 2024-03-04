import { Client } from "..";
import { hasKey, isOptional, isString, isValidMongoId } from "./types.utils";

export interface IRecipe {
	_id: string;
	userId: string;
	source?: string;
	title: string;
	description?: string;
	image: string;
	authors?: string[];
	category?: string[];
	cuisine?: string[];
	diet?: string[];
	keywords?: string[];
	prepTime?: number;
	cookTime?: number;
	totalTime?: number;
	yield: IRecipeYield;
	nutrition?: IRecipeNutritionalInformation;
	ingredients: RecipeIngredients;
	method: RecipeMethod;
	lastCooked?: Date;
	rating?: number;
	comments?: IRecipeComment[];
	isBookmarked?: boolean;
	isPublic?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type IRecipeSummary = Pick<
	IRecipe,
	| "_id"
	| "title"
	| "image"
	| "category"
	| "cuisine"
	| "keywords"
	| "prepTime"
	| "cookTime"
	| "totalTime"
	| "yield"
	| "diet"
	| "rating"
	| "isBookmarked"
	| "isPublic"
	| "createdAt"
	| "updatedAt"
> & {
	calories?: number;
	ingredientsCount: number;
	commentsCount: number;
};

export type IRecipeCreate = Omit<
	IRecipe,
	"_id" | "image" | "createdAt" | "updatedAt"
>;
export type IRecipeUpdate = Partial<IRecipe>;

export interface IRecipeSearchResult {
	recipe: IRecipeCreate;
	image: string;
}

export interface IRecipeParseResponse {
	recipe: Partial<IRecipeCreate>;
	image: string | undefined;
}

export type RecipeIngredients = IRecipeIngredient[];
export type RecipeMethod = IRecipeMethodSection[];

export interface IRecipeIngredient {
	item: string;
	quantity?: number[];
	unit?: string;
	prepStyles?: string;
	notes?: string;
	origin?: string;
	match?: IRecipeIngredientMatch | null;
}

export interface IRecipeIngredientMatch {
	itemId: number;
	name: string;
}

export interface IRecipeMethodSection {
	id: string;
	steps: IRecipeMethodStep[];
	sectionTitle?: string;
}

export interface IRecipeMethodStep {
	id: string;
	instructions: string;
	stepTitle?: string;
}

export interface IRecipeYield {
	quantity: Array<number>;
	units: string | null;
}

export interface IRecipeNutritionalInformation {
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
	servingSize?: IRecipeYield;
}

export interface IRecipeComment {
	userId: string;
	comment: string;
	createdAt: Date;
	replyTo?: string;
}

type IRecipeCommentCreateResource = Pick<IRecipeComment, "comment" | "replyTo">;

export interface IParseRecipeRequestBody {
	url: string;
}

export const isRecipeCommentCreateResource = (
	obj: any
): obj is IRecipeCommentCreateResource => {
	return (
		obj && isString(obj.comment) && isOptional(obj.replyTo, isValidMongoId)
	);
};

export const isParseRecipeRequestBody = (
	obj: any
): obj is IParseRecipeRequestBody => {
	return obj && isString(obj.url);
};

export const isSavedRecipe = (
	recipe: Client<IRecipe> | Client<IRecipeCreate>
): recipe is Client<IRecipe> => {
	return hasKey(recipe, "_id") && isValidMongoId(recipe._id);
};
