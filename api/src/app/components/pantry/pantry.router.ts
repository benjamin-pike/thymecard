import express from 'express';
import { IDependencies } from '../../lib/types/server.types';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { errorHandler } from '../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';

export const pantryRouter = (dependencies: IDependencies) => {
    const { pantryController } = dependencies;

    const router = express.Router();

    router
        .get(
            '/lookup',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                let { barcode, query } = req.query;
                
                barcode = barcode ? barcode.toString() : undefined;
                query = query ? query.toString() : undefined;
                
                const product = await pantryController.lookupProduct(context, barcode, query);
                res.status(HTTP_STATUS_CODES.OK).json({ product });
            })
        )

    return router;
};

export const pantryPermissions: IRoutePermissions = {
    'GET /pantry/lookup': [{ scope: AccessScope.PANTRY, permission: Permission.READ }],
};
