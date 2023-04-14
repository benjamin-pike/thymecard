import { LRUCache } from 'lru-cache';
import { IUser } from '../../components/user/user.types';

export type UserCache = LRUCache<string, IUser>;
