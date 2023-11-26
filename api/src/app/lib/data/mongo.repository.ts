import mongoose, { Document, FilterQuery, UpdateQuery, ProjectionFields, Model, model, Schema, PipelineStage } from 'mongoose';
import { ErrorCode } from '../error/errorCode';
import { BadRequestError, ConflictError } from '../error/thymecardError';
import { DeepPartial, isArray, isDateString, isDefined, isPlainObject, isValidMongoId } from '../types/typeguards.utils';
import { IPagedResult } from '../types/common.types';
import { compressAndEncrypt, decryptAndDecompress } from '../encryption.utils'
import { getPath } from '../types/object.utils';

interface IEntityKey {
    _id: string;
}
type Doc = Document<string>;

type Create<Entity> = DeepPartial<Omit<Entity, keyof IEntityKey>>;
type Update<Entity> = UpdateQuery<Entity & Doc>;
type Projection<Entity> = ProjectionFields<Entity & Doc>;

// Query and SortQuery do not support nested paths; use dot notation
type Query<Entity> = FilterQuery<Entity & Doc>;
export type SortQuery = Record<string, 1 | -1>;

export class MongoRepository<Entity extends IEntityKey, CreateEntity extends Create<Entity>> {
    protected model: Model<Entity & Doc>;

    constructor(collectionName: string, schema: Schema) {
        this.model = model<Entity & Doc>(collectionName, schema, collectionName);
        this.ensureIndexes();
    }

    private async ensureIndexes() {
        await this.model.ensureIndexes();
    }

    public async create(entity: CreateEntity): Promise<Entity> {
        try {
            const doc = await this.model.create(entity);
            const obj = doc.toObject();
            return this.convertObjectIdsToStrings(obj);
        } catch (err: any) {
            if (err.code === 11000) {
                const repoName = Object.getPrototypeOf(this).constructor.name;
                throw new ConflictError(
                    ErrorCode.MongoDuplicateKey,
                    `The value of '${Object.keys(err.keyPattern).join('-')}' violates a unique constraint`,
                    {
                        origin: `${repoName}.create`,
                        data: err.keyValue
                    }
                );
            }

            throw err;
        }
    }

    public async findOneAndUpdate<T = Entity>(
        query: Query<Entity>,
        update: Update<Entity>,
        projection?: Projection<Entity>,
        upsert: boolean = false
    ): Promise<T | null> {
        try {
            const doc = await this.model.findOneAndUpdate(query, update, { new: true, projection, upsert }).exec();

            if (!doc) {
                return null;
            }

            const obj = doc.toObject<Entity>();
            return this.convertObjectIdsToStrings(obj);
        } catch (err: any) {
            if (err.code === 11000) {
                const repoName = Object.getPrototypeOf(this).constructor.name;
                throw new ConflictError(
                    ErrorCode.MongoDuplicateKey,
                    `The value of '${Object.keys(err.keyPattern)[0]}' violates a unique constraint`,
                    {
                        origin: `${repoName}.create`,
                        data: err.keyValue
                    }
                );
            }
            throw err;
        }
    }

    public async delete(query: Query<Entity>): Promise<boolean> {
        const result = await this.model.deleteOne(query).exec();
        return result.deletedCount > 0;
    }

    public async upsert(query: Query<Entity>, update: Update<Entity>): Promise<Entity> {
        try {
            const doc = await this.model.findOneAndUpdate(query, update, { new: true, upsert: true }).exec();
            const obj = doc.toObject();
            return this.convertObjectIdsToStrings(obj);
        } catch (err: any) {
            if (err.code === 11000) {
                const repoName = Object.getPrototypeOf(this).constructor.name;
                throw new ConflictError(
                    ErrorCode.MongoDuplicateKey,
                    `The value of '${Object.keys(err.keyPattern)[0]}' violates a unique constraint`,
                    {
                        origin: `${repoName}.create`,
                        data: err.keyValue
                    }
                );
            }
            throw err;
        }
    }

    public async getOne<T = Entity>(query: Query<Entity>, projection?: Projection<T>): Promise<T | null> {
        const doc = await this.model.findOne(query, projection).exec();
        if (!doc) {
            return null;
        }
        const obj = doc.toObject();
        return this.convertObjectIdsToStrings(obj);
    }

    public async getAll<T = Entity>(query: Query<Entity>, projection?: Projection<T>): Promise<T[]> {
        const docs = await this.model.find(query, projection).exec();
        return docs.map((entity) => {
            const obj = entity.toObject();
            return this.convertObjectIdsToStrings(obj);
        });
    }

    public async getPaged<T = Entity>(
        filterQuery: Query<Entity>,
        startKey: string | null = null,
        limit: number = 100,
        sort?: SortQuery // Must use dot notation for nested paths
    ): Promise<IPagedResult<T>> {
        const sortQuery: SortQuery = sort ? { ...sort, _id: 1 } : { _id: 1 };
        const pagedQuery = this.pageStartKeyToQuery<Entity>(startKey, sortQuery);
        const query = pagedQuery ? { $and: [filterQuery, pagedQuery] } : filterQuery;

        const docs = await this.model
            .find(query)
            .sort(sort)
            .limit(limit + 1)
            .exec();

        const nextDoc = docs.length > limit ? docs.pop() : undefined;
        const nextQuery = nextDoc ? this.buildPageStartKey(nextDoc, sortQuery) : null;
        const nextKey = nextQuery ? this.encodePageStartKey(nextQuery) : null;

        if (!startKey && docs.length > 0) {
            const startQuery = this.buildPageStartKey(docs[0], sortQuery);
            startKey = this.encodePageStartKey(startQuery);
        }

        return {
            data: docs.map((entity) => {
                const obj = entity.toObject();
                return this.convertObjectIdsToStrings(obj);
            }),
            page: {
                count: docs.length,
                limit,
                startKey,
                nextKey
            }
        };
    }

    public async aggregateOne<T = Entity>(pipeline: PipelineStage[]): Promise<T | null> {
        const docs = await this.model.aggregate(pipeline).limit(1).exec();
        const obj = docs.map(this.convertObjectIdsToStrings);
        return obj[0] ?? null;
    }

    public async aggregateMany<T = Entity>(pipeline: PipelineStage[]): Promise<T[]> {
        const docs = await this.model.aggregate(pipeline).exec();
        return docs.map((entity) => {
            const obj = entity.toObject();
            return this.convertObjectIdsToStrings(obj);
        });
    }

    public async aggregatePaged<T = Entity>(
        filterQuery: Query<Entity>, // Must parse stringified objects (ObjectIds, Dates, etc.)
        partialPipeline: PipelineStage[], // Do not include a match stage, use filterQuery instead
        startKey: string | null = null,
        limit: number = 100,
        sort?: SortQuery // Must use dot notation for nested paths
    ): Promise<IPagedResult<T>> {
        const sortQuery: SortQuery = sort ? { ...sort, _id: 1 } : { _id: 1 };
        const pagedQuery = this.pageStartKeyToQuery<Entity>(startKey, sortQuery);
        const query = pagedQuery ? { $and: [filterQuery, pagedQuery] } : filterQuery;
        const pipeline = [{ $match: query }, ...partialPipeline, { $sort: sortQuery }];

        const docs = await this.model
            .aggregate(pipeline)
            .limit(limit + 1)
            .exec();

        const nextDoc = docs.length > limit ? docs.pop() : undefined;
        const nextQuery = nextDoc ? this.buildPageStartKey(nextDoc, sortQuery) : null;
        const nextKey = nextQuery ? this.encodePageStartKey(nextQuery) : null;

        if (!startKey && docs.length > 0) {
            const startQuery = this.buildPageStartKey(docs[0], sortQuery);
            startKey = this.encodePageStartKey(startQuery);
        }

        return {
            data: docs.map(this.convertObjectIdsToStrings),
            page: {
                count: docs.length,
                limit,
                startKey,
                nextKey
            }
        };
    }

    public async count(query: Query<Entity>): Promise<number> {
        return await this.model.countDocuments(query);
    }

    private convertObjectIdsToStrings(obj: any): any {
        if (obj instanceof mongoose.Types.ObjectId) {
            return obj;
        }
        if (isArray(obj)) {
            return obj.map((item) => this.convertObjectIdsToStrings(item));
        }
        if (isPlainObject(obj) && obj !== null) {
            return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, this.convertObjectIdsToStrings(value)]));
        } else {
            return obj;
        }
    }

    private buildPageStartKey(obj: any, sortByPath: Record<string, -1 | 1>): Record<string, unknown> {
        const values: Record<string, unknown> = {};
        for (const path of Object.keys(sortByPath)) {
            const value = getPath(obj, path);
            if (isDefined(value)) {
                values[path] = value;
            }
        }
        return values;
    }

    private pageStartKeyToQuery<Entity>(startKey: string | null, sortQuery: SortQuery): Query<Entity> | undefined {
        let currentQuery: Query<Entity> | undefined;
        let previousKey: string | undefined;

        const startQuery = startKey ? this.decodePageStartKey(startKey) : {};
        const sortKeys = Object.keys(sortQuery);
        const lastSortQueryKeyIndex = sortKeys.length - 1;

        for (let i = lastSortQueryKeyIndex; i >= 0; --i) {
            const currentKey = sortKeys[i];
            const sortOrder = sortQuery[currentKey];
            const currentValue = startQuery[currentKey];

            if (currentValue !== undefined) {
                const comparison = i === lastSortQueryKeyIndex ? (sortOrder === -1 ? '$lte' : '$gte') : sortOrder === -1 ? '$lt' : '$gt';

                const idValue = isValidMongoId(currentValue) ? new mongoose.Types.ObjectId(currentValue) : undefined;
                const dateValue = isDateString(currentValue) ? new Date(currentValue) : undefined;
                const coercedValue = idValue ?? dateValue ?? currentValue;

                const currentCriteria: Query<unknown> = { [currentKey]: { [comparison]: coercedValue } };

                if (previousKey) {
                    const equalsCurrentCriteria: Query<unknown> = { [currentKey]: coercedValue };
                    currentQuery = {
                        $or: [currentCriteria, { $and: [equalsCurrentCriteria, { ...currentQuery }] }]
                    };
                } else {
                    currentQuery = currentCriteria;
                }
            }
            previousKey = currentKey;
        }
        return currentQuery;
    }

    private decodePageStartKey(startKey: string): Record<string, string> {
        try {
            const urlDecodedStartKey = decodeURIComponent(startKey);
            const decoded = decryptAndDecompress(urlDecodedStartKey, false);
            return JSON.parse(decoded);
        } catch (err) {
            throw new BadRequestError(ErrorCode.InvalidPageStartKey, 'Invalid page start key', {
                origin: 'MongoRepository.decodePageStartKey',
                data: startKey
            });
        }
    }

    private encodePageStartKey(startQuery: Record<string, unknown>): string {
        const stringified = JSON.stringify(startQuery);
        const encryptedKey = compressAndEncrypt(stringified, false);
        return encodeURIComponent(encryptedKey);
    }
}
