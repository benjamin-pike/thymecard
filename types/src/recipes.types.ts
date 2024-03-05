import { Client } from "..";
import { hasKey, isOptional, isString, isValidMongoId } from "./types.utils";

export interface IRecipe {
	_id: string;
	userId: string;
	source: string | null;
	title: string;
	description: string | null;
	image: string;
	authors: string[];
	category: string[];
	cuisine: string[];
	diet: string[];
	prepTime: number | null;
	cookTime: number | null;
	totalTime: number | null;
	yield: IRecipeYield;
	nutrition: IRecipeNutritionalInformation;
	ingredients: RecipeIngredients;
	method: RecipeMethod;
	lastCooked: Date | null;
	rating: number | null;
	comments: IRecipeComment[];
	isBookmarked: boolean | null;
	isPublic: boolean;
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
	quantity: number[] | null;
	unit: string | null;
	prepStyles: string | null;
	notes: string | null;
	match: IRecipeIngredientMatch | null;
}

export interface IRecipeIngredientMatch {
	itemId: number;
	name: string;
}

export interface IRecipeMethodSection {
	id: string;
	steps: IRecipeMethodStep[];
	sectionTitle: string | null;
}

export interface IRecipeMethodStep {
	id: string;
	instructions: string;
	stepTitle: string | null;
}

export interface IRecipeYield {
	quantity: Array<number>;
	units: string | null;
}

export interface IRecipeNutritionalInformation {
	calories: number | null;
	sugar: number | null; // g
	carbohydrate: number | null; // g
	cholesterol: number | null; // mg
	fat: number | null; // g
	saturatedFat: number | null; // g
	transFat: number | null; // g
	unsaturatedFat: number | null; // g
	protein: number | null; // g
	fiber: number | null; // g
	sodium: number | null; // mg
	servingSize: IRecipeYield | null;
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

export const recipePrototype: IRecipe = {
	_id: "",
	userId: "",
	source: null,
	title: "",
	description: null,
	image: "",
	authors: [],
	category: [],
	cuisine: [],
	diet: [],
	prepTime: null,
	cookTime: null,
	totalTime: null,
	yield: {
		quantity: [],
		units: null
	},
	nutrition: {
		calories: null,
		sugar: null,
		carbohydrate: null,
		cholesterol: null,
		fat: null,
		saturatedFat: null,
		transFat: null,
		unsaturatedFat: null,
		protein: null,
		fiber: null,
		sodium: null,
		servingSize: null
	},
	ingredients: [],
	method: [],
	lastCooked: null,
	rating: null,
	comments: [],
	isBookmarked: null,
	isPublic: false,
	createdAt: new Date(),
	updatedAt: new Date()
};

export const clientRecipePrototype: Client<IRecipe> = JSON.parse(
	JSON.stringify(recipePrototype)
);
