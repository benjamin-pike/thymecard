import { LRUCache } from 'lru-cache';
import { IDay, IRecipe, IRecipeSummary, ISession, IUser } from '@thymecard/types';

export type OAuthNonceCache = LRUCache<string, string>;
export type SessionCache = LRUCache<string, ISession>;
export type TokenCache = LRUCache<string, string>;
export type UserCache = LRUCache<string, IUser>;
export type RecipeCache = LRUCache<string, IRecipe>;
export type RecipeSummaryCache = LRUCache<string, IRecipeSummary[]>;
export type DayCache = LRUCache<string, IDay>;
