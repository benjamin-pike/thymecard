import { createClient, RedisClientType } from 'redis';
import { InternalServerError } from '../error/sironaError';
import { ErrorCode } from '../error/errorCode';

interface IEntityKey {
    key: string;
}

interface Entity extends IEntityKey {
    [key: string]: any;
}

interface IRedisConfig {
    password: string;
    host: string;
    port: number;
}

export class RedisRepository {
    protected client: RedisClientType;

    constructor(config: IRedisConfig) {
        this.client = createClient({
            socket: {
                host: config.host,
                port: config.port
            },
            password: config.password
        });
    }

    public async connect(): Promise<void> {
        await this.client.connect();

        this.client.on('error', (err) => {
            throw new InternalServerError(ErrorCode.RedisConnectionError, 'A Redis error occured', {
                origin: 'RedisRepository.constructor',
                data: { err }
            });
        });
    }

    public async set(key: string, entity: Entity): Promise<void> {
        await this.client.set(key, JSON.stringify(entity))
    };

    public async get(key: string): Promise<Entity | null> {
        const entityString = await this.client.get(key);
        return entityString
            ? JSON.parse(entityString) 
            : null;
    }

    public async delete(key: string): Promise<boolean> {
        const result = await this.client.del(key);
        return result > 0;
    }

    public async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }
}
