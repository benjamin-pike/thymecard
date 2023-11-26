import { Prisma, type PrismaClient } from '@prisma/client';
import { IPantryProduct } from './pantry.types';
import { NotFoundError } from '../../lib/error/thymecardError';
import { ErrorCode } from '../../lib/error/errorCode';

interface IPantryServiceDependencies {
    prismaClient: PrismaClient;
}

export interface IPantryService {
    lookupBrandedProductByBarcode(barcode: string): Promise<IPantryProduct>;
    lookupGenericProductByName(query: string): Promise<IPantryProduct[]>;
}

export class PantryService implements IPantryService {
    private prismaClient: PrismaClient;

    constructor(deps: IPantryServiceDependencies) {
        this.prismaClient = deps.prismaClient;
    }

    public async lookupBrandedProductByBarcode(barcode: string): Promise<IPantryProduct> {
        const product = await this.prismaClient.brandedProducts.findUnique({
            where: {
                barcode
            }
        });

        if (!product) {
            throw new NotFoundError(ErrorCode.PantryProductNotFound, 'Product not found', {
                origin: 'PantryService.lookupProductByProduct',
                data: { barcode }
            });
        }

        return product as IPantryProduct;
    }

    public async lookupGenericProductByName(query: string): Promise<IPantryProduct[]> {
        throw new Error('Method not implemented.');
    }
}
