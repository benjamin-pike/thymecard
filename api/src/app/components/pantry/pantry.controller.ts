import { ErrorCode } from '../../lib/error/errorCode';
import { UnprocessableError } from '../../lib/error/thymecardError';
import { IAuthenticatedContext } from '../../middleware/context.middleware';
import { IPantryService } from './pantry.service';
import { IPantryProduct } from './pantry.types';

interface IPantryControllerDependencies {
    pantryService: IPantryService;
}

export interface IPantryController {
    lookupProduct(context: IAuthenticatedContext, barcode?: string, query?: string): Promise<IPantryProduct>;
}

export class PantryController implements IPantryController {
    private pantryService: IPantryService;

    constructor(deps: IPantryControllerDependencies) {
        this.pantryService = deps.pantryService;
    }

    public async lookupProduct(context: IAuthenticatedContext, barcode?: string, query?: string): Promise<IPantryProduct | any> {
        if (barcode && query) {
            throw new UnprocessableError(ErrorCode.InvalidQueryParameter, 'Only one of barcode or query string may be provided', {
                origin: 'PantryControler.lookupProduct'
            })
        }

        if (barcode) {
            return await this.pantryService.lookupBrandedProductByBarcode(barcode);
        }

        if (query) {
            return await this.pantryService.lookupGenericProductByName(query);
        }

        throw new UnprocessableError(ErrorCode.InvalidQueryParameter, 'A valid barcode or query string must be provided', {
            origin: 'PantryControler.lookupProduct'
        })
    }
}
