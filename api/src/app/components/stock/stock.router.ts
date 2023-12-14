import express from 'express';
import { errorHandler } from '../../lib/error/error.utils';
import HTTP_STATUS_CODES from 'http-status-enum';
import { AccessScope, IRoutePermissions, Permission } from '../../lib/auth/permissions';
import { IDependencies } from '../../lib/types/server.types';

export const stockRouter = (dependencies: IDependencies) => {
    const { stockController } = dependencies;
    
    const router = express.Router();

    router
        .put(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const { section, categories } = await stockController.upsertStockCategory(context, req.body);
                res.status(HTTP_STATUS_CODES.OK).json({ section, categories });
            })
        )
        .get(
            '/',
            errorHandler(async (req, res) => {
                const context = req.context.getAuthContext();
                const stock = await stockController.getStock(context);
                res.status(HTTP_STATUS_CODES.OK).json({ stock });
            })
        );

    return router;
};

export const stockPermissions: IRoutePermissions = {
    'PUT /stock': [{ scope: AccessScope.STOCK, permission: Permission.WRITE }],
    'GET /stock': [{ scope: AccessScope.STOCK, permission: Permission.READ }]
};

export default stockRouter;
