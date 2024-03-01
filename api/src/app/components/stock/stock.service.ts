import { ErrorCode, IStock, IStockCategory, StockSection } from '@thymecard/types';
import { stockRepository } from './stock.model';
import { InternalError } from '../../lib/error/thymecardError';

export interface IStockService {
    upsertStockCategory(userId: string, section: StockSection, categories: IStockCategory[]): Promise<IStockCategory[]>;
    getStock(userId: string): Promise<IStock>;
}

export class StockService implements IStockService {
    public async upsertStockCategory(userId: string, section: StockSection, categories: IStockCategory[]): Promise<IStockCategory[]> {
        const stock = await stockRepository.findOneAndUpdate(
            { userId },
            {
                [section]: categories
            },
            { upsert: true }
        );

        if (!stock) {
            throw new InternalError(ErrorCode.StockCategoryUpsertFailed, 'Failed to upsert stock category', {
                origin: 'StockService.upsertStockCategory',
                data: { userId, section, categories }
            });
        }

        return stock[section];
    }

    public async getStock(userId: string): Promise<IStock> {
        const stock = await stockRepository.getOne({ userId });

        if (!stock) {
            return {
                _id: '',
                userId,
                pantry: [],
                shoppingList: [],
                favorites: []
            };
        }

        return stock;
    }
}
