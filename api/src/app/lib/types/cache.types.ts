import { LRUCache } from 'lru-cache';
import { IUser } from '../../components/user/user.types';
import { IRecipe, IRecipeSummary } from '../../components/recipe/recipe.types';
import { IPlanner } from '../../components/planner/planner.types';

export type UserCache = LRUCache<string, IUser>;
export type RecipeCache = LRUCache<string, IRecipe>;
export type RecipeSummaryCache = LRUCache<string, IRecipeSummary[]>;
export type PlannerCache = LRUCache<string, IPlanner>;
