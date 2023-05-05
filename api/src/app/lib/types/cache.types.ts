import { LRUCache } from 'lru-cache';
import { IUser } from '../../components/user/user.types';
import { IRecipe, IRecipeSummary } from '../../components/recipe/recipe.types';
import { IDay } from '../../components/day/day.types';

export type UserCache = LRUCache<string, IUser>;
export type RecipeCache = LRUCache<string, IRecipe>;
export type RecipeSummaryCache = LRUCache<string, IRecipeSummary[]>;
export type DayCache = LRUCache<string, IDay>;
