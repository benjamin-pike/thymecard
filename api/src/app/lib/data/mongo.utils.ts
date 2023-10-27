import mongoose from 'mongoose';
import { logger } from '../../common/logger';
import { isPlainObject } from '../types/typeguards.utils';

export const establishMongoConnection = async (connectionString: string): Promise<void> => {
    try {
        await mongoose.connect(connectionString, {
            autoIndex: false,
            keepAlive: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000
        });

        logger.info('MongoDB connected successfully.');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
    }
};

export const buildSetQueryFromUpdate = (update: Record<string, any>, prefix = '') => {
    let setQuery: Record<string, any> = {};

    Object.entries(update).forEach(([key, value]) => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;

        if (isPlainObject(value)) {
            const nestedSetQuery = buildSetQueryFromUpdate(value, newPrefix);
            setQuery = { ...setQuery, ...nestedSetQuery };
        } else {
            setQuery[newPrefix] = value;
        }
    });

    return setQuery;
};
