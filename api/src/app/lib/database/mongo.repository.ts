import { Document, FilterQuery, Types, Model, model, Schema } from 'mongoose';
import { ErrorCode } from '../error/errorCode';
import { ConflictError } from '../error/sironaError';
import { isArray, isPlainObject } from '../types/types.utils';

interface IEntityKey {
    _id: string;
}
type Doc = Document<string>;

type Update<Entity> = Partial<Omit<Entity, keyof IEntityKey>>;
type Create<Entity> = Partial<Omit<Entity, keyof IEntityKey>>;

// Query and Sort do not support nested paths; use dot notation
type Query<Entity> = FilterQuery<Entity & Doc>;
type Sort<Entity> = { [P in keyof Entity]?: 1 | -1 } | { [key: string]: 1 | -1 };

const convertObjectIdsToStrings = (obj: any): any => {
    if (obj instanceof Types.ObjectId) {
        return obj;
    }
    if (isArray(obj)) {
        return obj.map((item) => convertObjectIdsToStrings(item));
    }
    if (isPlainObject(obj) && obj !== null) {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, convertObjectIdsToStrings(value)]));
    } else {
        return obj;
    }
};

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
            return convertObjectIdsToStrings(obj)
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

    public async findOneAndUpdate(query: Query<Entity>, update: Update<Entity>): Promise<Entity | null> {
        try {
            const doc = await this.model.findOneAndUpdate(query, update, { new: true }).exec();
            
            if (!doc) {
                return null;
            }
            
            const obj = doc.toObject<Entity>();
            return convertObjectIdsToStrings(obj);
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
            return convertObjectIdsToStrings(obj);
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

    public async getOne(query: Query<Entity>): Promise<Entity | null> {
        const doc = await this.model.findOne(query).exec();
        if (!doc) {
            return null;
        }
        const obj = doc.toObject()
        return convertObjectIdsToStrings(obj);
    }

    public async getAll(query: Query<Entity>): Promise<Entity[]> {
        const docs = await this.model.find(query).exec();
        return docs.map((entity) => {
            const obj = entity.toObject();
            return convertObjectIdsToStrings(obj);
        });
    }

    public async getPaged(query: Query<Entity>, page: number, limit: number, sort?: Sort<Entity>) {
        const entities = await this.model
            .find(query)
            .sort(sort ? { ...sort, _id: 1 } : { _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        return entities.map((entity) => {
            const obj = entity.toObject();
            return convertObjectIdsToStrings(obj);
        });
    }

    public async count(query: Query<Entity>): Promise<number> {
        return await this.model.countDocuments(query);
    }
}
