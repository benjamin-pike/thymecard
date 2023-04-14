import mongoose from 'mongoose';
import { logger } from '../../common/logger';

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
