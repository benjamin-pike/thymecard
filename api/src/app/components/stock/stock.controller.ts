import { ZodError } from 'zod';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IStockService } from './stock.service';
import { upsertStockSchema } from './stock.types';
import { UnprocessableError } from '../../lib/error/thymecardError';
import { ErrorCode } from '../../lib/error/errorCode';
import { formatZodError } from '../../lib/error/error.utils';
import { IStock, IStockCategory, StockSection } from '@thymecard/types';

interface IStockControllerDependencies {
    stockService: IStockService;
}

export interface IStockController {
    upsertStockCategory(context: IAuthenticatedContext, resource: unknown): Promise<IUpsertStockCategoryResponse>;
    getStock(context: IAuthenticatedContext): Promise<IStock>;
}

interface IUpsertStockCategoryResponse {
    section: StockSection;
    categories: IStockCategory[];
}

export class StockController implements IStockController {
    private stockService: IStockService;

    constructor(deps: IStockControllerDependencies) {
        this.stockService = deps.stockService;
    }

    public async upsertStockCategory(context: IAuthenticatedContext, resource: unknown): Promise<IUpsertStockCategoryResponse> {
        try {
            const parsedResource = upsertStockSchema.parse(resource);

            const { section, categories } = parsedResource;

            const updatedCategories = await this.stockService.upsertStockCategory(context.userId, section, categories);

            return { section, categories: updatedCategories };
        } catch (err) {
            if (err instanceof ZodError) {
                throw new UnprocessableError(ErrorCode.InvalidStockUpsertResource, formatZodError(err), {
                    origin: 'StockController.create',
                    data: { resource }
                });
            }

            throw err;
        }
    }

    public async getStock(context: IAuthenticatedContext): Promise<IStock> {
        const stock = await this.stockService.getStock(context.userId);

        return stock;
    }
}
